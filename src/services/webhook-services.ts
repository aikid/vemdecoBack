import type * as WebhookTypes from '../config/types/webhook-types'
import webhookRepository from '../repositories/webhook-repository'
import subscriptionServices from './subscription-services'
import { webhookPaymentStatus } from '../util/enums'

class WebhookServices {
  async createPaymentRegister(body: WebhookTypes.Payments) {
    if ((body.event === webhookPaymentStatus.RECEIVED || body.event === webhookPaymentStatus.CONFIRMED) && body.payment.subscription !== undefined) {
      await subscriptionServices.updatePaymentStatus(body.payment.subscription)
    }

    return await webhookRepository.createPaymentRegister(body)
  }

  async getPaymentRegister(gatewayCustomerId: string) {
    if (gatewayCustomerId !== '') {
      return await webhookRepository.getUserPaymentRegister(gatewayCustomerId)
    }
  }

  async getAllPaymentRegister() {
    return await webhookRepository.getAllPayments()
  }
}

export default new WebhookServices()
