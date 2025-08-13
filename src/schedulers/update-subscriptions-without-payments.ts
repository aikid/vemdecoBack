import cron from 'node-cron'
import subscriptionServices from '../services/subscription-services'

// Cancel subscriptions that have not received payment confirmation within 30 minutes of signing up
const updateSubscriptionWithoutPayments = cron.schedule('*/10 * * * *', async () => {
  console.log('Performing subscription update without payment')
  await subscriptionServices.updateSubscriptionsWithoutPayments()
})

export default updateSubscriptionWithoutPayments
