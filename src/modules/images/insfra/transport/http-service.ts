import { UploadImageCmd } from '@modules/images/usecase/upload.cmd'
import { ICommandHandler } from '@share/interface'
import { Request, Response } from 'express'
import fs from 'fs'
export class HTTPService {
  constructor(readonly uploadCmdHdl: ICommandHandler<UploadImageCmd, string>) {}

  async uploadImage(req: Request, res: Response) {
    try {
      const file = req.file as Express.Multer.File

      //check image type
      if (!file.mimetype.startsWith('image')) {
        res.status(400).send({ error: 'file is not image, cannot upload' })
        return
      }

      const cmd = new UploadImageCmd({
        objName: file.filename,
        filename: file.destination + '/' + file.filename,
        fileSize: file.size,
        contentType: file.mimetype,
        rmFile: true,
        changeName: true
      })

      const url = await this.uploadCmdHdl.execute(cmd)

      const html = fs.readFileSync('index.html', 'utf8')
      const newHtml = html.replace('__img__', url)
      fs.writeFileSync('index.html', newHtml)

      // Upload file index.html to S3
      const uploadCmdHtml = new UploadImageCmd({
        objName: 'index.html',
        filename: 'index.html',
        fileSize: newHtml.length,
        contentType: 'text/html'
      })

      const link = await this.uploadCmdHdl.execute(uploadCmdHtml)
      fs.writeFileSync('index.html', html)

      console.log(link)

      res.status(200).send({
        data: url
      })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }
}
