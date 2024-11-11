import 'module-alias/register'

import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'

import { AuthService } from '@modules/auth/module'
import { setupImageModule } from '@modules/images/module'

dotenv.config()
;(async () => {
  console.log('Connection successfully.')

  const app: Express = express()
  const port = process.env.PORT || 3000

  app.use(cors())
  app.use(express.json())

  app.get('/', (_: Request, res: Response) => {
    res.send('Express + TypeScript Server')
  })

  app.use('/v1', setupImageModule(new AuthService()))

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
})()
