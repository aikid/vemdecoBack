import { type NextFunction, type Request, type Response } from 'express'

import { env } from '../.env/index'
import TokenServices from '../util/jwt'
import { type subscriptionSignin } from '../config/types/subscription-types'
import { returnStringMessage } from '../util/formater'

interface decodedType {
  id: string | undefined
  name: string | undefined
  email: string | undefined
  iat: number | undefined
  exp: number | undefined
  subscription?: subscriptionSignin | undefined
  gatewayCustomerId?: string | undefined
}

class Private {
  admin (req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers

      if (authorization === undefined) {
        return res.status(401).json({ error: 'Authorization header is missing' })
      }

      const [type, token] = authorization.split(' ')

      if (type.toLowerCase() !== 'bearer') {
        return res.status(400).json({ error: 'Bearer token is missing' })
      }

      if (token.length === 0) {
        return res.status(401).json({ error: 'Authorization token is missing' })
      }

      const decoded = TokenServices.decodeJwt(token, env.SECRET_ADM_KEY) as decodedType

      if (decoded.id !== undefined && decoded.name !== undefined) {
        req.params.id = decoded.id
        req.params.name = decoded.name
        next()
      }
    } catch (e: any) {
      throw new Error(e)
    }
  }

  user (req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers

      if (authorization === undefined) {
        return res.status(401).json({ error: 'Authorization header is missing' })
      }

      const [type, token] = authorization.split(' ')

      if (type.toLowerCase() !== 'bearer') {
        return res.status(400).json({ error: 'Bearer token is missing' })
      }

      if (token === undefined) {
        return res.status(401).json({ error: 'Authorization token is missing' })
      }

      const decoded = TokenServices.decodeJwt(token, env.SECRET_USR_KEY) as decodedType

      if (decoded.id !== undefined && decoded.name !== undefined && decoded.email !== undefined &&
        decoded.subscription !== undefined && decoded.gatewayCustomerId !== undefined) {
        req.params.id = decoded.id
        req.params.name = decoded.name
        req.params.email = decoded.email
        req.params.planId = decoded.subscription.planId
        req.params.subscriptionId = decoded.subscription.subscriptionId
        req.params.limit = returnStringMessage(decoded.subscription.limit)
        req.params.active = decoded.subscription.status ? 'yes' : 'no'
        req.params.gatewayCustomerId = decoded.gatewayCustomerId
        next()
      }
    } catch (e: any) {
      throw new Error(e)
    }
  }
}

export default new Private()
