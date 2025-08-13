import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import GenericValidator from '../validators/generic-validator'
import type * as GenericTypes from '../config/types/generic-types'
import GenericServices from '../services/generic-services'

class GenericController {
  async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const body = GenericValidator.sendEmail(req.body)

      await GenericServices.sendEmail(body as GenericTypes.sendEmail)

      Logger.captureResult(req, { send: true })
      return res.status(201).json()
    } catch (e) {
      next(e)
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = GenericValidator.resetPassword(req.body)

      const update = await GenericServices.updatePassword(body as GenericTypes.updatePassword)

      if (update === null) {
        return res.status(204).json()
      }

      const response = { message: 'Password updated successfully' }
      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }

  async getUserState(req: Request, res: Response, next: NextFunction) {
    try {
      const states = await GenericServices.getStates()

      Logger.captureResult(req, states)

      return res.json(states)
    } catch (e) {
      next(e)
    }
  }
}

export default new GenericController()
