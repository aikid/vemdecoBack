import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import AdminValidator from '../validators/admin-validator'
import type * as AdminTypes from '../config/types/admin-types'
import type * as PlanTypes from '../config/types/plan-types'
import AdminServices from '../services/admin-services'
import PlanServices from '../services/plan-services'
import WebhookServices from '../services/webhook-services'

class AdminController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = AdminValidator.create(req.body)
      await AdminServices.create(body as AdminTypes.createAdmin)
      return res.status(202).json()
    } catch (e) {
      next(e)
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = AdminValidator.signin(req.body)
      const user = await AdminServices.signin(body as AdminTypes.signin)

      if (user === null) return res.status(204).json()

      if (user === false) return res.status(403).json({ message: 'Invalid email or password ' })

      Logger.captureResult(req, user)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.userId = req.params.id
      req.body.userName = req.params.name

      const body = AdminValidator.createPlan(req.body)
      const pattern = /^\d+\.\d{2}$/

      if (!pattern.test(body.value)) {
        console.log(body.value.toString())
        return res.status(400).json({ message: 'Enter a value with two decimal places' })
      }

      const plan = await PlanServices.createPlan(body as PlanTypes.createPlan)

      Logger.captureResult(req, plan)
      return res.json(plan)
    } catch (e) {
      next(e)
    }
  }

  async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await PlanServices.listPlans()

      if (plans.length === 0) {
        return res.status(204).json()
      }

      Logger.captureResult(req, plans)
      return res.json(plans)
    } catch (e) {
      next(e)
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const body = AdminValidator.createPlan(req.body)
      const pattern = /^\d+\.\d{2}$/

      if (!pattern.test(body.value.toString())) {
        return res.status(400).json({ message: 'Enter a value with two decimal places' })
      }

      // const plan = await AdminServices.update(body as PlanTypes.updatePlan)

      // Logger.captureResult(req, plan)

      return res.json({})
    } catch (e) {
      next(e)
    }
  }

  async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await WebhookServices.getAllPaymentRegister()

      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }
}

export default new AdminController()
