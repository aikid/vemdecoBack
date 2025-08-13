import { Schema, model } from 'mongoose'

const ModelName: string = 'State'

const StateSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  type: String,
  document: String,
  occupation: String,
  zipCode: String,
  state: String,
  city: String,
  address: String,
  number: String,
  complement: String,
  neighborhood: String,
  birthdate: String,
  secondPhone: String
}, {
  timestamps: true
})

export default model(ModelName, StateSchema)
