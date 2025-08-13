import validator from 'validator'
import { type AxiosRequestConfig } from 'axios'

import { validateCPF, validateCNPJ } from '../util/document-validator'
import { encryptPassword, comparePassword } from '../util/bcrypt'
import type * as UserTypes from '../config/types/user-types'
import userRepository from '../repositories/user-repository'
import TokenServices from '../util/jwt'
import SubscriptionServices from './subscription-services'
import { type subscriptionSignin } from '../config/types/subscription-types'
import { env } from '../.env'
import GatewayConnect from '../util/asaas'
import { createCustomer } from '../util/buildGatewayRequest'
import type * as GatewayTypes from '../config/types/gateway-types'
import adminRepository from '../repositories/admin-repository'

class UserServices {
  async create(body: UserTypes.createUser) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Email is invalid')
    }

    const isStrongPassword = validator.isStrongPassword(body.password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1
    })

    if (!isStrongPassword) {
      throw new Error('Password is weak')
    }

    if (body.type === 'pf') {
      if (!validateCPF(body.document)) {
        throw new Error('Invalid CPF')
      }
    } else {
      if (!validateCNPJ(body.document)) {
        throw new Error('Invalid CNPJ')
      }
    }

    await this.validateDataInUse(body.email, body.document)

    body.password = encryptPassword(body.password)

    const axiosRequest: AxiosRequestConfig = {
      method: 'POST',
      url: env.ASAAS_URL_CUSTOMER,
      data: createCustomer(body)
    }

    const gatewayUser: GatewayTypes.customerCreated = await GatewayConnect.start(axiosRequest)

    if (gatewayUser.id && gatewayUser.id !== null) body.gatewayCustomerId = gatewayUser.id

    const user: any = await userRepository.create(body)

    if (user !== null) {
      await SubscriptionServices.automaticSubscription(user)
    }

    return { id: user._id, name: user.name, email: user.email, phone: user.phone }
  }

  async signin(body: UserTypes.signin) {
    const isEmail = validator.isEmail(body.email)

    if (!isEmail) {
      throw new Error('Insira um email válido.')
    }

    const user: any = await userRepository.findByEmail(body.email)

    if (user === null) {
      return null
    }

    const checkPassword: boolean = comparePassword(body.password, user.password)

    if (!checkPassword) {
      return checkPassword
    }

    user.isAdmin = false
    const userIsAdmin = await adminRepository.findByEmail(user.email)

    if (userIsAdmin !== null) {
      user.isAdmin = true
    }

    const aux: any = await SubscriptionServices.find(user._id.toString(), false)

    const subscription: subscriptionSignin = {
      status: aux?.status && !aux?.paymentData?.paymentPending,
      limit: aux?.planId?.limit,
      subscriptionId: aux?._id,
      planId: aux?.planId?._id,
      planName: aux?.planId?.name,
      isTrial: aux?.planId?.isTrial,
      consumption: aux?.consumption
    }

    const token = TokenServices.generate(user._id as string, user.name as string, user.email as string, 'user', subscription, user.gatewayCustomerId)

    return { type: 'Bearer', token, username: user.name, subscription, gatewayCustomerId: user.gatewayCustomerId, isAdmin: user.isAdmin }
  }

  async updatePassword(body: UserTypes.signin) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Insira um email válido.')
    }

    const user: any = await userRepository.findByEmail(body.email)

    if (user === null) {
      return null
    }

    return []
  }

  async validateDataInUse(email: string, document: string) {
    const emailInUse = await userRepository.findByEmail(email)

    if (emailInUse !== null) {
      throw new Error('Esse email já está registrado.')
    }

    const documentInUse = await userRepository.findByDocument(document)
    if (documentInUse !== null) {
      throw new Error('Já existe um cadastro com este documento.')
    }
  }

  async getUserInfo(id: string) {
    const user = await userRepository.findById(id)
    if (user === null) {
      throw new Error('User not registered')
    }

    return user
  }

  async userExists(id: string): Promise<boolean> {
    const user = await userRepository.findById(id)
    if (user === null) {
      return false
    }

    return true
  }

  async updateUser(body: UserTypes.updateUser) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Email is invalid')
    }
    if (body.type === 'pf') {
      if (!validateCPF(body.document)) {
        throw new Error('Invalid CPF')
      }
    } else {
      if (!validateCNPJ(body.document)) {
        throw new Error('Invalid CNPJ')
      }
    }

    const userUpdated = await userRepository.update(body)
    return userUpdated
  }

  async getUserById(id: string) {
    return await userRepository.findById(id)
  }

  async getUserByEmail(email: string) {
    return await userRepository.findByEmail(email)
  }

  async getUsers() {
    const users = await userRepository.findByAll()
    if (users.length < 0) {
      throw new Error('Users not registered')
    }

    return users
  }
}

export default new UserServices()
