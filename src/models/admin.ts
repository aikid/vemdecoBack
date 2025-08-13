import { Schema, model } from 'mongoose'

const ModelName: string = 'Admin'

const AdminSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  password: String
}, {
  timestamps: true
})

export default model(ModelName, AdminSchema)
