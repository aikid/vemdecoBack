import { type NextFunction, type Request, type Response } from 'express'
import { env } from '../.env/index'

class Gateway {
  async private (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['asaas-access-token'] as string

      if (token === undefined) {
        return res.status(400).json({ error: 'Parameter asaas-access-token is mandatory' })
      }
      if (token !== env.ASAAS_ACCESS_TOKEN) {
        return res.status(401).json({ error: 'Token is incorrect' })
      }
      next()
    } catch (e: any) {
      throw new Error(e)
    }
  }
}

export default new Gateway()
