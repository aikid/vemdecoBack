import { Schema, model } from 'mongoose'

const ModelName: string = 'UserPwd'

const UserPwdSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  email: String,
  token: String,
  updated: Boolean
},
{
  timestamps: true
})

export default model(ModelName, UserPwdSchema)
