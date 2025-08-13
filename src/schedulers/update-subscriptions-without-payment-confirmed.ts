import cron from 'node-cron'
import subscriptionServices from '../services/subscription-services'

// Cancel subscriptions that have not had payment confirmed by the due date by the gateway
const updateSubscriptionWithoutPaymentConfirmed = cron.schedule('10 0 * * *', async () => {
  console.log('Performing subscription update without payment confirmed')
  await subscriptionServices.updateSubscriptionWithoutPaymentConfirmed()
})

export default updateSubscriptionWithoutPaymentConfirmed
