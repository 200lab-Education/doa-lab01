import { UploadImageCmd } from "@modules/images/usecase/upload.cmd";
import { ICommandHandler } from "@share/interface";
import { Request, Response } from "express";

export class HTTPService {
  constructor(
    readonly uploadCmdHdl: ICommandHandler<UploadImageCmd, string>
  ) { }

  async uploadImage(req: Request, res: Response) {
    try {
      const file = req.file as Express.Multer.File;

      //check image type
      if (!file.mimetype.startsWith('image')) {
        res.status(400).send({ error: 'file is not image, cannot upload' });
        return;
      }

      const cmd = new UploadImageCmd({
        objName: file.filename,
        filename: file.destination + '/' + file.filename,
        fileSize: file.size,
        contentType: file.mimetype
      });

      const url = await this.uploadCmdHdl.execute(cmd);

      res.status(200).send({
        data: url
      });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
}