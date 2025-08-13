import validator from 'validator'

import { encryptPassword } from '../util/bcrypt'
import type * as GenericTypes from '../config/types/generic-types'
import userRepository from '../repositories/user-repository'
import adminRepository from '../repositories/admin-repository'
import genericRepository from '../repositories/generic-repository'
import EmailService from '../util/nodemailer'
import TokenServices from '../util/jwt'
import { env } from '../.env/index'

class GenericServices {
  async sendEmail(body: GenericTypes.sendEmail) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Insira um email válido.')
    }

    const user: any = body.type === 'admin' ? await adminRepository.findByEmail(body.email) : await userRepository.findByEmail(body.email)

    if (user === null) {
      throw new Error('Usuário não encontrado')
    }

    const bodyToRequest = {
      userId: user._id,
      name: user.name,
      email: user.email,
      token: TokenServices.updatePassword(user.email),
      updated: false
    }

    await genericRepository.createUserRequestToUpdatePwd(bodyToRequest as GenericTypes.tokenToUpdatePwd)

    await EmailService.send(bodyToRequest as GenericTypes.mailOptions)
  }

  async updatePassword(body: GenericTypes.updatePassword) {
    const isStrongPassword = validator.isStrongPassword(body.password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1
    })

    if (!isStrongPassword) {
      throw new Error('A senha digita não atende os critérios de segurança.')
    }

    const decoded: any = TokenServices.decodeJwt(body.token, env.SECRET_UPD_PWD)

    if (decoded === undefined && decoded.email === undefined) {
      throw new Error('Token está incorreto ou expirou.')
    }

    const updatedStatus: boolean = false
    const userPwd: any = await genericRepository.findUserRequestToUpdatePwd(body.token, updatedStatus)

    if (userPwd === null) return null

    const password: string = encryptPassword(body.password)

    await userRepository.findByEmailAndUpdatePassword(userPwd.email, password)

    await genericRepository.updateUserRequestToUpdatePwd(body.token)
  }

  async getStates() {
    const states = await genericRepository.findAllStates()
    if (states === null) {
      throw new Error('States not registered')
    }

    return states
  }
}

export default new GenericServices()
