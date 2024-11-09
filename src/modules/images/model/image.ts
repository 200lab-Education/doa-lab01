export interface ImageUploadDTO {
  objName: string
  filename: string
  fileSize: number
  contentType: string
  rmFile?: boolean
  changeName?: boolean
}
