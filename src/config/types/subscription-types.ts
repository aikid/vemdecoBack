import { type Types } from 'mongoose'

interface usersArray {
  name: string
  email: string
  userId: string
}

interface paymentData {
  paymentStatus: boolean
  paymentPending: boolean
  limitDate: string | null
  contractedPlan: any
  gatewaySubscripitionId: any
}

interface subscriptionCreate {
  ownerId: string
  planId: string | null
  backupPlan: any
  backupPlanIsTrial: boolean | null
  status: boolean
  consumption: number
  dataStart: string
  dataEnd: string
  dueDate: string | null
  nextDueDate: string | null
  gatewaySubscripitionId: string | null
  shouldCancel: boolean
  paymentData: paymentData
  users: usersArray[]
}

interface getSubscription {
  _id: Types.ObjectId
  ownerId: Types.ObjectId
  planId: Types.ObjectId
  backupPlan: any
  status: boolean
  consumption: number
  dataStart: string
  dataEnd: string
  dueDate: string | null
  nextDueDate: string | null
  gatewaySubscripitionId: string | null
  shouldCancel: boolean
  paymentData: paymentData
  users: usersArray[]
}

interface subscriptionBindCreate {
  _id: string
  ownerId: string
  planId: string
  status: boolean
  consumption: number
  dataStart: string
  dataEnd: string
  paymentStatus: boolean
  users: usersArray[]
}

interface subscriptionSignin {
  status: boolean
  limit: number
  subscriptionId: string
  planId: string
  planName: string
  isTrial: boolean
  consumption: number
}

interface subscriptionUpdate {
  ownerId: string
  subscriptionId: string
  planId: string
  gatewayCustomerId: string
}

export type { usersArray, paymentData, subscriptionCreate, getSubscription, subscriptionSignin, subscriptionUpdate, subscriptionBindCreate }
