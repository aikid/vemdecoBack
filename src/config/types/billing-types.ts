interface createMethod {
  name: string
  email: string
  phone: string
  document: string
  zipCode: string
  address: string
  number: string
  holderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  ccv: string
  userId: string
  gatewayCustomerId: string
  default?: boolean | undefined
}

interface BillingMethods {
  _id: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  default: boolean
}

interface setDefaultBillingMethod {
  userId: string
  id: string
}

interface deleteBillingMethod {
  id: string
  force?: boolean
  userId?: string
}

export type { createMethod, BillingMethods, setDefaultBillingMethod, deleteBillingMethod }
