import { z } from 'zod'

import type * as GenericTypes from '../config/types/generic-types'
import GeneralValidator from './general'

class GenericValidator {
  sendEmail(body: GenericTypes.sendEmail) {
    const bodySchema = z.object({
      email: z.string(),
      type: z.enum(['user', 'admin']).default('user')
    })

    return GeneralValidator(bodySchema, body)
  }

  resetPassword(body: GenericTypes.sendEmail) {
    const bodySchema = z.object({
      token: z.string(),
      password: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new GenericValidator()
