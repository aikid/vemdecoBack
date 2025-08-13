interface Payments {
  id: string
  event: string
  dateCreated: string
  payment: {
    object: string
    id: string
    dateCreated: string
    customer: string
    subscription?: string
    installment?: string
    paymentLink?: string
    dueDate: string
    originalDueDate: string
    value: number
    netValue: number
    originalValue?: number
    interestValue?: number
    nossoNumero?: string
    description: string
    externalReference: string
    billingType: string
    status: string
    pixTransaction?: string
    confirmedDate: string
    paymentDate: string
    clientPaymentDate: string
    installmentNumber?: number
    creditDate: string
    custody?: string
    estimatedCreditDate: string
    invoiceUrl: string
    bankSlipUrl?: string
    transactionReceiptUrl: string
    invoiceNumber: string
    deleted: boolean
    anticipated: boolean
    anticipable: boolean
    lastInvoiceViewedDate: string
    lastBankSlipViewedDate?: string
    postalService: boolean
    creditCard: {
      creditCardNumber: string
      creditCardBrand: string
      creditCardToken: string
    }
    discount: {
      value: number
      dueDateLimitDays: number
      limitedDate?: string
      type: string
    }
    fine: {
      value: number
      type: string
    }
    interest: {
      value: number
      type: string
    }
    split: Array<{
      walletId: string
      fixedValue?: number
      percentualValue?: number
      status: string
      refusalReason?: string
    }>
    chargeback: {
      status: string
      reason: string
    }
    refunds?: any
  }
}

export type { Payments }
