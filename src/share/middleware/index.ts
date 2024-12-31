import { IAuthService } from '@share/interface'
import { Handler } from 'express'
import { authMiddleware } from './auth'

export interface MdlFactory {
  auth: Handler
}

export const setupMiddlewares = (authService: IAuthService): MdlFactory => {
  const auth = authMiddleware(authService)

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    auth
  }
}
