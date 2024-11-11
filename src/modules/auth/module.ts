import { IAuthService } from '@share/interface'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

export class AuthService implements IAuthService {
  private client: any

  constructor() {
    const PROTO_PATH = path.resolve(__dirname, 'auth.proto')
    console.log(PROTO_PATH)

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    const AuthService = protoDescriptor.pb.AuthService

    const client = new AuthService(process.env.AUTH_SERVICE_HOST || 'localhost:3100', grpc.credentials.createInsecure())
    this.client = client
  }

  async introspectToken(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.IntrospectToken({ access_token: accessToken }, (error: any, response: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}
