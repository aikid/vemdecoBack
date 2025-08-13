import { z } from 'zod'

import type * as BillingTypes from '../config/types/billing-types'
import GeneralValidator from './general'

class BillingValidator {
  createMethod(body: BillingTypes.createMethod) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().min(12).max(13),
      document: z.string().min(11).max(13),
      zipCode: z.string().length(8),
      address: z.string(),
      number: z.string(),
      holderName: z.string(),
      cardNumber: z.string().length(16),
      expiryMonth: z.string(),
      expiryYear: z.string(),
      ccv: z.string(),
      userId: z.string(),
      gatewayCustomerId: z.string(),
      default: z.boolean().default(false)
    })

    return GeneralValidator(bodySchema, body)
  }

  setDefaultBillingMethod(body: BillingTypes.setDefaultBillingMethod) {
    const bodySchema = z.object({
      userId: z.string(),
      id: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }

  deleteBillingMethod(body: BillingTypes.deleteBillingMethod) {
    const bodySchema = z.object({
      id: z.string(),
      force: z.boolean().default(false)
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new BillingValidator()
