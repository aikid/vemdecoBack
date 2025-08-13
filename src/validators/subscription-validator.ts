import { z } from 'zod'

import type * as SubscriptionTypes from '../config/types/subscription-types'
import GeneralValidator from './general'

class SubscriptionValidator {
  create(body: SubscriptionTypes.subscriptionCreate) {
    const bodySchema = z.object({
      ownerId: z.string(),
      planId: z.string(),
      backupPlan: z.any(),
      backupPlanIsTrial: z.boolean().nullable().default(null),
      status: z.boolean(),
      consumption: z.number(),
      dataStart: z.string(),
      dataEnd: z.string(),
      dueDate: z.string().nullable().default(null),
      nextDueDate: z.string().nullable().default(null),
      gatewaySubscripitionId: z.string().nullable().default(null),
      shouldCancel: z.boolean().default(false),
      paymentData: z.object({
        paymentStatus: z.boolean().default(true),
        paymentPending: z.boolean().default(false),
        limitDate: z.string().nullable(),
        contractedPlan: z.string().nullable().default(null),
        gatewaySubscripitionId: z.string().nullable().default(null)
      }),
      users: z.array(z.object({
        name: z.string(),
        email: z.string(),
        userId: z.string()
      }))
    })

    return GeneralValidator(bodySchema, body)
  }

  update(body: SubscriptionTypes.subscriptionUpdate) {
    const bodySchema = z.object({
      ownerId: z.string(),
      subscriptionId: z.string(),
      planId: z.string(),
      gatewayCustomerId: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }

  bind(body: SubscriptionTypes.usersArray) {
    const bodySchema = z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new SubscriptionValidator()
