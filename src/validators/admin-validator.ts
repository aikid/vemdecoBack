import { z } from 'zod'

import type * as AdminTypes from '../config/types/admin-types'
import type * as PlanTypes from '../config/types/plan-types'

import GeneralValidator from './general'

class AdminValidator {
  create(body: AdminTypes.createAdmin) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string().min(12).max(13),
      password: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }

  signin(body: AdminTypes.signin) {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }

  createPlan(body: PlanTypes.createPlan) {
    const bodySchema = z.object({
      name: z.string(),
      isTrial: z.boolean().default(false),
      value: z.string(),
      limit: z.number().min(1).max(999999999999999),
      type: z.enum(['prepaid', 'billed']),
      active: z.boolean(),
      userId: z.string(),
      userName: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }

  updatePlan(body: PlanTypes.updatePlan) {
    const bodySchema = z.object({
      id: z.string(),
      name: z.string().optional(),
      gatewayId: z.string().optional(),
      value: z.number().refine((val) => {
        return /^\d+(\.\d{1,2})?$/.test(val.toFixed(2))
      }, {
        message: 'The value must be a number and have two decimal places'
      }),
      active: z.boolean().optional()
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new AdminValidator()
