import { type AxiosRequestConfig } from 'axios'

import GatewayConnect from '../util/asaas'
import { createSubscription } from '../util/buildGatewayRequest'
import type * as GatewayTypes from '../config/types/gateway-types'
import type * as PlanTypes from '../config/types/plan-types'
import { env } from '../.env'

class GatewayServicecs {
  async createGatewaySubscription(body: PlanTypes.createPlan, gatewayCustomerId: string) {
    const data = createSubscription(body, gatewayCustomerId)

    const axiosRequest: AxiosRequestConfig = {
      method: 'POST',
      url: env.ASAAS_URL_SUBSCRIPTION,
      data
    }

    return await GatewayConnect.start(axiosRequest)
  }

  async getPaymentLink(gatewayCustomerId: string) {
    const url: string = env.ASAAS_URL_SUBSCRIPTION + `/${gatewayCustomerId}/payments?status=PENDING`

    const axiosRequest: AxiosRequestConfig = {
      method: 'GET',
      url
    }

    const payments: GatewayTypes.PaymentList = await GatewayConnect.start(axiosRequest)

    if (payments.totalCount === 0) throw new Error('No pending payments found')

    const data: GatewayTypes.Payment[] = payments.data.reverse()

    return data[0].invoiceUrl
  }

  async deleteGatewaySubscription(gatewaySubscripitionId: string) {
    const url: string = env.ASAAS_URL_SUBSCRIPTION + `/${gatewaySubscripitionId}`

    const axiosRequest: AxiosRequestConfig = {
      method: 'DELETE',
      url
    }

    console.log('axiosRequest', axiosRequest)

    const responseCancel = await GatewayConnect.start(axiosRequest)

    console.log('responseCancel', responseCancel)

    return responseCancel
  }
}

export default new GatewayServicecs()
