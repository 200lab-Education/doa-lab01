import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { IImageUploader } from "@share/interface";
import { config } from "dotenv";
import fs from "fs";

config();

export class S3Uploader implements IImageUploader {
  constructor() { }

  async uploadImage(objName: string, filename: string, filesize: number, contentType: string): Promise<boolean> {
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: objName,
        Body: fs.readFileSync(filename),
        ContentType: contentType,
        ContentLength: filesize
      },
      tags: [
        /*...*/
      ], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false // optional manually handle dropped parts
    });

    await parallelUploads3.done();
    return true;
  }

  cloudName(): string {
    return 'aws-s3';
  }

  getFullURL(objectName: string): string {
    return process.env.URL_PUBLIC + '/' + objectName;
  }
}

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string
  }
});