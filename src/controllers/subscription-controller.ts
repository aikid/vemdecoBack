import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import SubscriptionValidator from '../validators/subscription-validator'
import type * as SubscriptionTypes from '../config/types/subscription-types'
import DateTime from '../util/date-time'
import SubscriptionServices from '../services/subscription-services'

class SubscriptionController {
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.params
      const status: boolean = true

      if (userId === undefined) {
        throw new Error('Please, insert a ID')
      }
      const subscription = await SubscriptionServices.find(userId, status)

      Logger.captureResult(req, subscription)

      if (subscription === null) {
        return res.status(204).json()
      }

      return res.json(subscription)
    } catch (e) {
      next(e)
    }
  }

  async checkAtiveSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.params
      const status: boolean = true

      if (userId === undefined) {
        throw new Error('Please, insert a ID')
      }
      const subscription = await SubscriptionServices.checkActiveSubscriptions(userId, status)

      Logger.captureResult(req, subscription)

      if (subscription === null) {
        return res.status(204).json()
      }

      return res.json({ active: subscription })
    } catch (e) {
      next(e)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, id: userId } = req.params

      const requestBody: SubscriptionTypes.subscriptionCreate = {
        ownerId: req.params.id,
        planId: req.body.planId,
        backupPlan: null,
        backupPlanIsTrial: null,
        status: true,
        consumption: 0,
        dataStart: DateTime.now('YYYY-MM-DD'),
        dataEnd: DateTime.futureDate(32, 'YYYY-MM-DD'),
        dueDate: null,
        nextDueDate: null,
        gatewaySubscripitionId: null,
        shouldCancel: false,
        paymentData: {
          paymentStatus: true,
          paymentPending: false,
          limitDate: null,
          contractedPlan: null,
          gatewaySubscripitionId: null
        },
        users: [{
          name,
          email,
          userId
        }]
      }

      const body = SubscriptionValidator.create(requestBody)

      const subscription = await SubscriptionServices.create(body as SubscriptionTypes.subscriptionCreate)

      Logger.captureResult(req, subscription)

      return res.json(subscription)
    } catch (e) {
      next(e)
    }
  }

  async updateSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId, id: userId, gatewayCustomerId } = req.params

      const requestBody: SubscriptionTypes.subscriptionUpdate = {
        ownerId: userId,
        subscriptionId,
        planId: req.body.planId,
        gatewayCustomerId
      }

      const body = SubscriptionValidator.update(requestBody)

      const subscription = await SubscriptionServices.updateSubscription(body as SubscriptionTypes.subscriptionUpdate)

      Logger.captureResult(req, subscription)

      return res.json(subscription)
    } catch (e) {
      next(e)
    }
  }

  async getPaymentLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query

      const invoiceUrl = await SubscriptionServices.getPaymentLink(id as string)

      Logger.captureResult(req, { invoiceUrl })

      return res.json({ invoiceUrl })
    } catch (e) {
      next(e)
    }
  }

  async bindSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.body.ownerId !== undefined ? req.body.ownerId : req.params.id

      const body = SubscriptionValidator.bind(req.body)

      const subscription = await SubscriptionServices.bindSubscription(ownerId, body as SubscriptionTypes.usersArray)

      Logger.captureResult(req, subscription)

      return res.json(subscription)
    } catch (e) {
      next(e)
    }
  }

  async deleteSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const subscription = await SubscriptionServices.deleteGatewaySubscription(id)

      Logger.captureResult(req, subscription)

      return res.json(subscription)
    } catch (e) {
      next(e)
    }
  }
}

export default new SubscriptionController()
