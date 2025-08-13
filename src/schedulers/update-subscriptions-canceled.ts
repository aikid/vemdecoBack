import cron from 'node-cron'
import subscriptionServices from '../services/subscription-services'

// Update subscription with cancellation request
const updateSubscriptionCanceled = cron.schedule('20 0 * * *', async () => {
  console.log('Performing subscription canceled')
  await subscriptionServices.updateSubscriptionsCanceled()
})

export default updateSubscriptionCanceled
