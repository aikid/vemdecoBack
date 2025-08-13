import type * as SubscriptionTypes from '../config/types/subscription-types'

import subscriptionRepository from '../repositories/subscription-repository'
import DateTime from '../util/date-time'

import type * as GatewayTypes from '../config/types/gateway-types'
import gatewayServices from './gateway-services'
import planServices from './plan-services'

class SubscriptionServices {
  async automaticSubscription(user: any) {
    const plans: any = await planServices.listActivePlans()

    if (plans === null) return

    const planId: string | undefined = plans.find((row: any) => row.isTrial)._id

    if (planId === undefined) return

    const users: SubscriptionTypes.usersArray[] = [
      {
        name: user.name,
        email: user.email,
        userId: user._id.toString()
      }
    ]

    const requestBody: SubscriptionTypes.subscriptionCreate = {
      ownerId: user._id,
      planId,
      backupPlan: null,
      backupPlanIsTrial: null,
      status: true,
      consumption: 0,
      dataStart: DateTime.now('YYYY-MM-DD'),
      dataEnd: DateTime.futureDate(32, 'YYYY-MM-DD'),
      dueDate: null,
      nextDueDate: null,
      gatewaySubscripitionId: null,
      shouldCancel: false,
      paymentData: {
        paymentStatus: true,
        paymentPending: false,
        limitDate: null,
        contractedPlan: null,
        gatewaySubscripitionId: null
      },
      users
    }

    await this.create(requestBody)
  }

  async create(body: SubscriptionTypes.subscriptionCreate) {
    const subscription: any = await this.find(body.ownerId, true)
    if (subscription === null) {
      return await subscriptionRepository.create(body)
    } else {
      throw new Error('Já existe uma assinatura para essa conta.')
    }
  }

  async find(userId: string, status: boolean) {
    return await subscriptionRepository.find(userId, status)
  }

  async checkActiveSubscriptions(userId: string, status: boolean) {
    const subscription: any = await this.find(userId, status)
    if (subscription === null) return null
    return subscription.consumption < subscription.planId.limit
  }

  async updateConsumption(userId: string, limit: string) {
    const subscription: any = await this.find(userId.toString(), true)

    if (subscription === null) throw new Error('Ocorreu uma falha ao processar sua requisição.')

    subscription.consumption += 1

    await subscriptionRepository.update(subscription.ownerId, subscription)
  }

  async updateSubscription(body: SubscriptionTypes.subscriptionUpdate) {
    const subscription: any = await subscriptionRepository.find(body.ownerId, true)

    if (subscription === null) throw new Error('Changing the plan can only be done by the subscription owner')

    const newPlan: any = await planServices.findPlan(body.planId)

    if (newPlan === null) throw new Error('Plan not found')

    if (newPlan.isTrial) throw new Error('Unable to change to trial plan')

    if (newPlan._id.toString() === subscription.planId._id.toString()) throw new Error('We were unable to process your request, the selected plan is already active')

    if (newPlan.limit === undefined || subscription.consumption === undefined) throw new Error('There was an error processing your request.')

    if (subscription.paymentData.paymentPending) throw new Error('You have a pending plan change request, cancel the order before purchasing a new one.')

    subscription.backupPlan = subscription.planId
    subscription.backupPlanIsTrial = subscription.planId.isTrial
    subscription.paymentData.paymentStatus = false
    subscription.paymentData.paymentPending = true
    subscription.paymentData.limitDate = DateTime.futureDateInMinutes(30, 'YYYY-MM-DD HH:mm')

    subscription.paymentData.contractedPlan = newPlan

    const gatewaySubscription: GatewayTypes.subscriptionCreated = await gatewayServices.createGatewaySubscription(newPlan, body.gatewayCustomerId)

    subscription.paymentData.gatewaySubscripitionId = gatewaySubscription.id

    await subscriptionRepository.update(body.ownerId, subscription)

    return subscription
  }

  async bindSubscription(ownerId: string, body: SubscriptionTypes.usersArray) {
    const bindedSubscription: any = await subscriptionRepository.find(ownerId, true)

    if (bindedSubscription === undefined) throw new Error('Ocorreu uma falha ao localizar a assinatura de vinculação.')

    const actualSubscription: any = await subscriptionRepository.find(body.userId, true)
    if (actualSubscription === undefined) throw new Error('Ocorreu uma falha ao localizar sua assinatura.')

    const isUserSubscription = bindedSubscription.users.filter((row: { userId: string }) => row.userId === body.userId)
    if (isUserSubscription.length > 0) throw new Error('Usuário já vinculado a essa assinatura.')

    if (actualSubscription.ownerId.toString() !== body.userId) {
      const actualIndexSubscription: number = actualSubscription.users.findIndex((row: { userId: string }) => row.userId === body.userId)
      if (actualIndexSubscription !== -1) {
        const users: any = actualSubscription.users
        users.splice(actualIndexSubscription, 1)
        actualSubscription.users = users
        await actualSubscription.save()
      }
    }

    const users: any = bindedSubscription.users
    users.push(body)

    await subscriptionRepository.updateField(ownerId, 'users', users)

    await subscriptionRepository.updateField(body.userId, 'status', false)

    return bindedSubscription
  }

  async getPaymentLink(gatewayCustomerId: string) {
    return await gatewayServices.getPaymentLink(gatewayCustomerId)
  }

  async updatePaymentStatus(gatewaySubscripitionId: string) {
    const subscription: any = await subscriptionRepository.findByGatewaySubscripitionId(gatewaySubscripitionId)

    if (subscription === null) return { message: 'Failed to process your payment' }

    if (subscription.paymentData.gatewaySubscripitionId !== null) {
      if (!subscription.backupPlanIsTrial) await gatewayServices.deleteGatewaySubscription(subscription.gatewaySubscripitionId)

      const newPlan = subscription.paymentData.contractedPlan

      subscription.gatewaySubscripitionId = subscription.paymentData.gatewaySubscripitionId
      subscription.planId = newPlan._id
      subscription.status = true
      subscription.paymentData.paymentStatus = true
      subscription.paymentData.paymentPending = false
      subscription.paymentData.limitDate = null
      subscription.paymentData.contractedPlan = null
      subscription.paymentData.gatewaySubscripitionId = null
      subscription.backupPlan = null
      subscription.backupPlanIsTrial = null
    }

    subscription.dueDate = DateTime.now('YYYY-MM-DD')
    subscription.nextDueDate = DateTime.futureDate(31, 'YYYY-MM-DD')
    subscription.dataEnd = DateTime.futureDate(32, 'YYYY-MM-DD')
    subscription.consumption = 0

    await subscriptionRepository.update(subscription.ownerId, subscription)

    return subscription
  }

  async updateSubscriptionsWithoutPayments() {
    const subscriptions: any = await subscriptionRepository.findSubscriptionsWithoutPayments()

    if (subscriptions.length === 0) {
      console.log('There is no subscription to be cancelled due to non-payment of the subscription.')
    }

    const trialPlan = await planServices.findTrialPlan()

    if (trialPlan === null) throw new Error('Failed to locate trial plan')

    for (const subscription of subscriptions) {
      subscription.paymentData.paymentStatus = true
      subscription.paymentData.paymentPending = false
      subscription.paymentData.limitDate = null
      subscription.paymentData.contractedPlan = null
      subscription.planId = subscription.backupPlan
      subscription.backupPlan = null
      subscription.backupPlanIsTrial = null

      await gatewayServices.deleteGatewaySubscription(subscription.paymentData.gatewaySubscripitionId)

      subscription.paymentData.gatewaySubscripitionId = null

      await subscription.save()

      console.log(`Unpaid subscription ${subscription._id.toString()} updated successfully`)
    }

    return subscriptions
  }

  async updateSubscriptionsCanceled() {
    const subscriptions: any = await subscriptionRepository.findSubscriptionsCanceled()

    if (subscriptions.length === 0) {
      console.log('There are no subscriptions to canceled')
    }

    const trialPlan = await planServices.findTrialPlan()

    if (trialPlan === null) throw new Error('Failed to locate trial plan')

    for (const subscription of subscriptions) {
      await gatewayServices.deleteGatewaySubscription(subscription.gatewaySubscripitionId)

      subscription.gatewaySubscripitionId = null
      subscription.paymentData.paymentStatus = true
      subscription.paymentData.paymentPending = false
      subscription.paymentData.limitDate = null
      subscription.paymentData.contractedPlan = null
      subscription.paymentData.gatewaySubscripitionId = null
      subscription.dueDate = null
      subscription.nextDueDate = null
      subscription.planId = trialPlan._id
      subscription.backupPlan = null
      subscription.consumption = trialPlan.limit
      subscription.backupPlanIsTrial = null
      subscription.shouldCancel = false

      await subscription.save()

      console.log(`Canceled subscription ${subscription._id.toString()} updated successfully`)
    }

    return subscriptions
  }

  async updateSubscriptionWithoutPaymentConfirmed() {
    const subscriptions: any = await subscriptionRepository.findSubscriptionsWithoutConfirmed()

    if (subscriptions.length === 0) {
      console.log('There is no subscription to be cancelled due to non-payment by the due date.')
    }

    const trialPlan = await planServices.findTrialPlan()

    if (trialPlan === null) throw new Error('Failed to locate trial plan')

    for (const subscription of subscriptions) {
      await gatewayServices.deleteGatewaySubscription(subscription.gatewaySubscripitionId)

      subscription.gatewaySubscripitionId = null
      subscription.paymentData.paymentStatus = true
      subscription.paymentData.paymentPending = false
      subscription.paymentData.limitDate = null
      subscription.dataEnd = null
      subscription.planId = trialPlan._id
      subscription.backupPlan = null
      subscription.consumption = trialPlan.limit
      subscription.backupPlanIsTrial = null
      subscription.shouldCancel = false

      await subscription.save()

      console.log(`Canceled subscription whitout payment confirmed ${subscription._id.toString()} updated successfully`)
    }

    return subscriptions
  }

  async deleteGatewaySubscription(id: string) {
    const subscription: any = await this.find(id, true)

    if (subscription === null) throw new Error('Subscription not found')

    if (id !== subscription.ownerId.toString()) throw new Error('The subscription can only be cancelled by the owner')

    if (subscription.planId.isTrial) {
      if (subscription.paymentData.paymentPending) {
        const responseCancel = await gatewayServices.deleteGatewaySubscription(subscription.paymentData.gatewaySubscripitionId)
        subscription.paymentData.paymentStatus = true
        subscription.paymentData.paymentPending = false
        subscription.paymentData.gatewaySubscripitionId = null
        subscription.paymentData.limitDate = null
        subscription.paymentData.contractedPlan = null
        subscription.backupPlan = null
        subscription.backupPlanIsTrial = null
        subscription.save()
        return responseCancel
      } else {
        throw new Error('It is not possible to delete a subscription from a trial plan.')
      }
    } else {
      const responseCancel = await gatewayServices.deleteGatewaySubscription(subscription.gatewaySubscripitionId)

      subscription.shouldCancel = true
      subscription.save()

      return responseCancel
    }
  }
}

export default new SubscriptionServices()
