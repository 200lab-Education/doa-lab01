import { IAuthService } from '@share/interface'
import { NextFunction, Request, Response } from 'express'

export function authMiddleware(authService: IAuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const result = await authService.introspectToken(token)
      if (!result) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      res.locals.requester = result

      next()
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}
