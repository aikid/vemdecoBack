import { z } from 'zod'

import type * as NotificationTypes from '../config/types/notification-types'
import GeneralValidator from './general'

class NotificationValidator {
  create(body: NotificationTypes.createNotification) {
    const bodySchema = z.object({
      ownerId: z.string(),
      userId: z.string(),
      notificationType: z.enum(['invite-subscription']),
      active: z.boolean().default(true),
      data: z.any().optional()
    })

    return GeneralValidator(bodySchema, body)
  }

  update(body: NotificationTypes.updateNotification) {
    const bodySchema = z.object({
      id: z.string(),
      active: z.boolean()
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new NotificationValidator()
