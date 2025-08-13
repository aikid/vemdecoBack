import { Router, type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import WebhookControler from '../controllers/webhook-controller'
import Gateway from '../middlewares/gateway'
import Private from '../middlewares/private'

const gatewayRoutes = Router()

gatewayRoutes.use(Logger.preHandler)

gatewayRoutes.post('/payments-webhook', Gateway.private, WebhookControler.createPaymentRegister)

gatewayRoutes.get('/user-payments', Private.user, WebhookControler.getPaymentsRegister)

gatewayRoutes.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  try {
    const message = JSON.parse(err.message)
    return res.status(400).json({
      status: 400,
      message
    })
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: err.message
    })
  }
})

export default gatewayRoutes
