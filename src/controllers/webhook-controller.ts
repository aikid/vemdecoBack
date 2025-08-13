import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import type * as WebhookTypes from '../config/types/webhook-types'
import WebhookServices from '../services/webhook-services'

class WebhookController {
  async createPaymentRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await WebhookServices.createPaymentRegister(req.body as WebhookTypes.Payments)

      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }

  async getPaymentsRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await WebhookServices.getPaymentRegister(req.params.gatewayCustomerId)

      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }
}

export default new WebhookController()
