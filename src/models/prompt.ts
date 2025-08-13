import { Schema, model } from 'mongoose'

const ModelName: string = 'Prompt'

const PromptSchema = new Schema({
  email: String,
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  prompt: String,
  category: String,
  default: Boolean
}, {
  timestamps: true
})

export default model(ModelName, PromptSchema)
