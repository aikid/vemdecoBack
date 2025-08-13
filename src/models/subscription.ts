import { Schema, model } from 'mongoose'

const ModelName: string = 'Subscription'

const SubscriptionSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    require: true
  },
  backupPlan: Schema.Types.Mixed,
  backupPlanIsTrial: Schema.Types.Mixed,
  status: Boolean,
  consumption: Number,
  dataStart: String,
  dataEnd: String,
  dueDate: String,
  nextDueDate: String,
  gatewaySubscripitionId: String,
  shouldCancel: Boolean,
  paymentData: {
    paymentStatus: Boolean,
    paymentPending: Boolean,
    limitDate: String,
    contractedPlan: Schema.Types.Mixed,
    gatewaySubscripitionId: Schema.Types.Mixed
  },
  users: [
    {
      name: String,
      email: String,
      userId: String
    }
  ]
},
{
  timestamps: true
})

export default model(ModelName, SubscriptionSchema)
