import type * as NotificationTypes from '../config/types/notification-types'
import notificationRepository from '../repositories/notification-repository'

class NotificationServices {
  async create(body: NotificationTypes.createNotification) {
    return await notificationRepository.create(body)
  }

  async findAllNotifications(id: string, active: boolean) {
    return await notificationRepository.findAllNotifications(id, active)
  }

  async findNotification(id: string) {
    return await notificationRepository.findNotification(id)
  }

  async updateNotification(body: NotificationTypes.updateNotification) {
    const notification = this.findNotification(body.id)

    if (notification === null) return null

    return await notificationRepository.updateNotification(body)
  }
}

export default new NotificationServices()
