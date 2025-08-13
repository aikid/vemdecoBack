import { Schema, model } from 'mongoose'

const ModelName: string = 'Notification'

const NotificationSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  notificationType: String,
  active: Boolean,
  data: Object
},
{
  timestamps: true
})

export default model(ModelName, NotificationSchema)
