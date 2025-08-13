import subscription from '../models/subscription'

import type * as SubscriptionTypes from '../config/types/subscription-types'
import dateTime from '../util/date-time'

class SubscriptionRepositories {
  async create(body: SubscriptionTypes.subscriptionCreate) {
    return await subscription.create(body)
  }

  async find(userId: string, status: boolean) {
    const query: any = {
      users: {
        $elemMatch: {
          userId
        }
      }
    }

    if (status) {
      query.status = status
    }

    return await subscription.findOne(query).populate('planId')
  }

  async findByGatewaySubscripitionId(gatewaySubscripitionId: string) {
    const query = {
      $or: [
        { 'paymentData.gatewaySubscripitionId': gatewaySubscripitionId },
        { gatewaySubscripitionId }
      ]
    }
    return await subscription.findOne(query)
  }

  async update(ownerId: string, body: SubscriptionTypes.subscriptionCreate) {
    const query = { ownerId }
    return await subscription.findOneAndUpdate(query, { $set: body })
  }

  async updateField(ownerId: string, field: string, value: any) {
    const query = { ownerId }
    const update = { $set: { [field]: value } }
    return await subscription.updateOne(query, update)
  }

  async findSubscriptionsWithoutPayments() {
    const currentDate = dateTime.now('YYYY-MM-DD HH:mm')

    const query = {
      'paymentData.paymentPending': true,
      'paymentData.limitDate': { $lt: currentDate }
    }

    return await subscription.find(query)
  }

  async findSubscriptionsCanceled() {
    const currentDate = dateTime.now('YYYY-MM-DD')

    const query = {
      shouldCancel: true,
      dataEnd: currentDate
    }

    return await subscription.find(query)
  }

  async findSubscriptionsWithoutConfirmed() {
    const currentDate = dateTime.now('YYYY-MM-DD')

    const query = {
      dataEnd: currentDate
    }

    return await subscription.find(query)
  }
}

export default new SubscriptionRepositories()
