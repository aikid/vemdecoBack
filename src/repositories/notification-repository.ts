import notification from '../models/notification'

import type * as NotificationTypes from '../config/types/notification-types'

class NotificationRepository {
  async create(body: NotificationTypes.createNotification) {
    return await notification.create(body)
  }

  async findAllNotifications(userId: string, active: boolean) {
    return await notification.find({ userId, active })
  }

  async findNotification(id: string) {
    return await notification.findById(id)
  }

  async updateNotification(body: NotificationTypes.updateNotification) {
    const query = { _id: body.id }
    return await notification.findOneAndUpdate(query, { $set: { active: body.active } })
  }
}

export default new NotificationRepository()
