import { Schema, model } from 'mongoose'

const ModelName: string = 'Plan'

const PlanSchema = new Schema({
  name: String,
  isTrial: Boolean,
  value: String,
  active: Boolean,
  limit: Number,
  type: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  },
  userName: String
}, {
  timestamps: true
})

export default model(ModelName, PlanSchema)
