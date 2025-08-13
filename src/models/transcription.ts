import { Schema, SchemaTypes, model } from 'mongoose'

const modelName = 'transcription'

const transcriptionSchema = new Schema({
  customer: String,
  link: String,
  data: SchemaTypes.Mixed,
  expireDate: Date
}, {
  timestamps: true
})

transcriptionSchema.index({ expireDate: 1 }, { expireAfterSeconds: 0 })

export default model(modelName, transcriptionSchema)
