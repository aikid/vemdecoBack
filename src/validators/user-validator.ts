import { z } from 'zod'

import type * as UserTypes from '../config/types/user-types'
import GeneralValidator from './general'

class UserValidator {
  create(body: UserTypes.createUser) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().min(12).max(13),
      password: z.string(),
      type: z.enum(['pf', 'pj']),
      document: z.string().min(11).max(14)
    })

    return GeneralValidator(bodySchema, body)
  }

  signin(body: UserTypes.signin) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string()
    })

    return GeneralValidator(bodySchema, body)
  }

  getUserByEmail(body: UserTypes.updatePassword) {
    const bodySchema = z.object({
      email: z.string().email()
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new UserValidator()
