import { S3Uploader } from '@component/s3_uploader'
import { ensureDirectoryExistence } from '@share/utils'
import { Router } from 'express'
import multer from 'multer'
import { HTTPService } from './insfra/transport/http-service'
import { UploadCommandHandler } from './usecase/upload.cmd'

import { IAuthService } from '@share/interface'

export function setupImageModule(authService: IAuthService): Router {
  const router = Router()

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = process.env.UPLOAD_PATH || 'uploads'
      ensureDirectoryExistence(uploadPath)
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.originalname)
    }
  })

  const upload = multer({ storage: storage })

  const uploadCmdHandler = new UploadCommandHandler(new S3Uploader())
  const service = new HTTPService(uploadCmdHandler)

  // const mid = setupMiddlewares(authService)
  // router.use(mid.auth)

  router.post('/upload-image', upload.single('file'), service.uploadImage.bind(service))

  return router
}
