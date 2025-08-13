import type * as BillingTypes from '../config/types/billing-types'
import billingRepository from '../repositories/billing-repository'
import { encrypt } from '../util/encrypt'
import { maskBillings } from '../util/maskBillings'

class BillingServices {
  async createMethod(body: BillingTypes.createMethod) {
    body.holderName = encrypt(body.holderName)
    body.cardNumber = encrypt(body.cardNumber)
    body.expiryMonth = encrypt(body.expiryMonth)
    body.expiryYear = encrypt(body.expiryYear)
    body.ccv = encrypt(body.ccv)

    const defaultMethod = await this.getUserDefaultBillingMethods(body.userId)

    if (body.default && defaultMethod !== null) {
      await this.updateDefaultMethod(defaultMethod._id.toString(), false)
    }

    if (defaultMethod === null) body.default = true

    return await billingRepository.create(body)
  }

  async getUserBillingMethods(id: string) {
    const billings: any = await billingRepository.getUserBillingMethods(id)

    if (billings.length > 0) {
      const response = billings.map(maskBillings)
      return response
    } else {
      return []
    }
  }

  async getUserDefaultBillingMethods(id: string) {
    return await billingRepository.getUserDefaultBillingMethods(id)
  }

  async setDefaultBillingMethod(body: BillingTypes.setDefaultBillingMethod) {
    const defaultMethod = await this.getUserDefaultBillingMethods(body.userId)

    if (defaultMethod !== null) {
      await this.updateDefaultMethod(defaultMethod._id.toString(), false)
    }

    return await this.updateDefaultMethod(body.id, true)
  }

  async updateDefaultMethod(id: string, status: boolean) {
    return await billingRepository.updateDefaultMethod(id, status)
  }

  async deletetBillingMethod(body: BillingTypes.deleteBillingMethod) {
    const selectedMethod = await billingRepository.getBillingById(body.id)

    if (selectedMethod === null) throw new Error('Failed to locate payment method')

    if (selectedMethod.userId !== body.userId) throw new Error('You cannot delete this method')

    if (selectedMethod !== null && selectedMethod.default && !body.force) {
      return { success: false, message: 'The selected payment method is the default payment method' }
    }

    await billingRepository.deletetBillingMethod(body.id)

    return { success: true, message: 'The selected was deleted successfully' }
  }
}

export default new BillingServices()
