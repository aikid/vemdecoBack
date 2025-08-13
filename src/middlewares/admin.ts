import { type NextFunction, type Request, type Response } from 'express'
import { env } from '../.env/index'

class Admin {
  async private (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['x-api-token'] as string

      if (token === undefined) {
        return res.status(400).json({ error: 'Parameter x-api-token is mandatory' })
      }
      if (token !== env.ADM_TOKEN) {
        return res.status(401).json({ error: 'Token is incorrect' })
      }
      next()
    } catch (e: any) {
      throw new Error(e)
    }
  }
}

export default new Admin()
