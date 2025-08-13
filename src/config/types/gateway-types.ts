interface createCustomer {
  name: string
  email: string
  phone: string
  cpfCnpj: string
}

interface customerCreated {
  object: string
  id: string | null
  dateCreated: string
  name: string
  email: string
  company: string | null
  phone: string
  mobilePhone: string | null
  address: string | null
  addressNumber: string | null
  complement: string | null
  province: string | null
  postalCode: string | null
  cpfCnpj: string
  personType: string
  deleted: boolean
  additionalEmails: string | null
  externalReference: string | null
  notificationDisabled: false
  observations: string | null
  municipalInscription: string | null
  stateInscription: string | null
  canDelete: true
  cannotBeDeletedReason: string | null
  canEdit: true
  cannotEditReason: string | null
  city: string | null
  cityName: string | null
  state: string | null
  country: string
}

interface subscriptionCreated {
  object: 'subscription'
  id: string
  dateCreated: string
  customer: string
  paymentLink: string | null
  value: number
  nextDueDate: string // ou Date
  cycle: string
  description: string
  billingType: string
  deleted: boolean
  status: string
  externalReference: string | null
  creditCard: string | null
  sendPaymentByPostalService: boolean
  fine: {
    value: number
    type: string
  }
  interest: {
    value: number
    type: string
  }
  split: string | null
};

interface Discount {
  value: number
  limitDate: string | null
  dueDateLimitDays: number
  type: string
}

interface Fine {
  value: number
  type: string
}

interface Interest {
  value: number
  type: string
}

interface Payment {
  object: string
  id: string
  dateCreated: string
  customer: string
  subscription: string
  paymentLink: string | null
  value: number
  netValue: number
  originalValue: number | null
  interestValue: number | null
  description: string
  billingType: string
  confirmedDate: string | null
  creditCard: string | null
  pixTransaction: string | null
  status: string
  dueDate: string
  originalDueDate: string
  paymentDate: string | null
  clientPaymentDate: string | null
  installmentNumber: number | null
  invoiceUrl: string
  invoiceNumber: string
  externalReference: string | null
  deleted: boolean
  anticipated: boolean
  anticipable: boolean
  creditDate: string | null
  estimatedCreditDate: string | null
  transactionReceiptUrl: string | null
  nossoNumero: string | null
  bankSlipUrl: string | null
  lastInvoiceViewedDate: string | null
  lastBankSlipViewedDate: string | null
  discount: Discount
  fine: Fine
  interest: Interest
  postalService: boolean
  custody: string | null
  refunds: string | null
}

interface PaymentList {
  object: string
  hasMore: boolean
  totalCount: number
  limit: number
  offset: number
  data: Payment[]
}

export type { createCustomer, customerCreated, subscriptionCreated, PaymentList, Payment }
