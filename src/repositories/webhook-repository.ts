import webhookPayment from '../models/webhook-payment'

import type * as WebhookTypes from '../config/types/webhook-types'

class BillingRepository {
  async createPaymentRegister(body: WebhookTypes.Payments) {
    return await webhookPayment.create(body)
  }

  async getUserPaymentRegister (gatewayCustomerId: string) {
    return await webhookPayment.find({ 'payment.customer': gatewayCustomerId, 'payment.status': 'CONFIRMED' })
  }

  async getAllPayments() {
    return await webhookPayment.find()
  }
}

export default new BillingRepository()
