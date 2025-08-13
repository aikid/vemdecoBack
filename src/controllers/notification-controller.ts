import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'

import NotificationValidator from '../validators/notification-validator'
import NotificationServices from '../services/notification-services'

import type * as NotificationTypes from '../config/types/notification-types'

class NotificationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (typeof req.body.data === 'string') {
        req.body.data = JSON.parse(req.body.data)
      }
      req.body.ownerId = req.params.id
      const body = NotificationValidator.create(req.body)

      if (body.ownerId === body.userId) throw new Error('Não é possível enviar um convite para si mesmo.')

      const notification = await NotificationServices.create(body as NotificationTypes.createNotification)

      Logger.captureResult(req, notification)

      return res.json(notification)
    } catch (e) {
      next(e)
    }
  }

  async findAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id
      const active: boolean = req.query.active !== undefined && req.query.active === 'yes'

      const notifications = await NotificationServices.findAllNotifications(id, active)
      return res.json(notifications)
    } catch (e) {
      next(e)
    }
  }

  async updateNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const body = NotificationValidator.update(req.body)

      const updatedNotification: any = await NotificationServices.updateNotification(body as NotificationTypes.updateNotification)

      if (updatedNotification === null) return res.status(204).json()

      return res.json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}

export default new NotificationController()
