import validator from 'validator'

import { encryptPassword, comparePassword } from '../util/bcrypt'
import type * as AdminTypes from '../config/types/admin-types'
import adminRepository from '../repositories/admin-repository'
import TokenServices from '../util/jwt'

class AdminServices {
  async create(body: AdminTypes.createAdmin) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Insira um email válido.')
    }

    const isStrongPassword = validator.isStrongPassword(body.password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1
    })

    if (!isStrongPassword) {
      throw new Error('A senha digita não atende os critérios de segurança.')
    }

    await this.validateDataInUse(body.email)

    body.password = encryptPassword(body.password)

    await adminRepository.create(body)

    return true
  }

  async signin(body: AdminTypes.signin) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Insira um email válido.')
    }

    const admin: any = await adminRepository.findByEmail(body.email)

    if (admin === null) {
      return null
    }

    const checkPassword: boolean = comparePassword(body.password, admin.password)

    if (!checkPassword) {
      return checkPassword
    }

    const token = TokenServices.generate(admin._id as string, admin.name as string, admin.email as string, 'admin', null, null)

    return { type: 'Bearer', token }
  }

  async validateDataInUse(email: string) {
    const emailInUse = await adminRepository.findByEmail(email)

    if (emailInUse !== null) {
      throw new Error('Esse email já está registrado.')
    }
  }
}

export default new AdminServices()
