import { ICommandHandler, IImageUploader } from '@share/interface'
import fs from 'fs'
import { ImageUploadDTO } from '../model/image'
export class UploadImageCmd {
  constructor(readonly dto: ImageUploadDTO) {}
}

export class UploadCommandHandler implements ICommandHandler<UploadImageCmd, string> {
  constructor(readonly uploader: IImageUploader) {}

  async execute(cmd: UploadImageCmd): Promise<string> {
    const now = new Date()

    const newFilename = now.getDate() + '-' + now.getFullYear() + '/' + now.getMilliseconds() + '_' + cmd.dto.objName

    await this.uploader.uploadImage(newFilename, cmd.dto.filename, cmd.dto.fileSize, cmd.dto.contentType)

    try {
      fs.unlink(cmd.dto.filename, (err) => {
        console.error(err)
      })
    } catch (e) {
      console.log(e)
    }

    return this.uploader.getFullURL(newFilename)
  }
}

