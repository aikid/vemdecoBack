import os from 'os'

import type * as GatewayTypes from '../config/types/gateway-types'
import type * as UserTypes from '../config/types/user-types'

import dateTime from './date-time'
import { env } from '../.env'

const getLocalIp = (): any => {
  const interfaces = os.networkInterfaces()
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName]
    if (addresses !== undefined) {
      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        if (address.family === 'IPv4' && !address.internal) {
          return address.address
        }
      }
    }
  }
  return '1.1.1.1'
}

export const createCustomer = (body: UserTypes.createUser): GatewayTypes.createCustomer => {
  return {
    name: body.name,
    email: body.email,
    phone: body.phone,
    cpfCnpj: body.document
  }
}

export const createSubscription = (body: any, gatewayCustomerId: string): any => {
  return {
    billingType: 'CREDIT_CARD',
    cycle: 'MONTHLY',
    customer: gatewayCustomerId,
    value: parseFloat(body.value),
    nextDueDate: dateTime.now('YYYY-MM-DD'),
    description: `Assinatura ${body.name}`,
    remoteIp: getLocalIp(),
    callback: {
      successUrl: env.ASAAS_CALLBACK_URL
    }
  }
}
