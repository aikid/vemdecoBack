import { Schema, model } from 'mongoose'

const ModelName: string = 'WebhookPayment'

const EventSchema = new Schema({
  id: { type: String, required: true },
  event: { type: String, required: true },
  dateCreated: { type: String, required: true },
  payment: {
    object: String,
    id: String,
    dateCreated: String,
    customer: String,
    subscription: String,
    installment: String,
    paymentLink: String,
    dueDate: String,
    originalDueDate: String,
    value: Number,
    netValue: Number,
    originalValue: Number,
    interestValue: Number,
    nossoNumero: String,
    description: String,
    externalReference: String,
    billingType: String,
    status: String,
    pixTransaction: String,
    confirmedDate: String,
    paymentDate: String,
    clientPaymentDate: String,
    installmentNumber: Number,
    creditDate: String,
    custody: String,
    estimatedCreditDate: String,
    invoiceUrl: String,
    bankSlipUrl: String,
    transactionReceiptUrl: String,
    invoiceNumber: String,
    deleted: Boolean,
    anticipated: Boolean,
    anticipable: Boolean,
    lastInvoiceViewedDate: String,
    lastBankSlipViewedDate: String,
    postalService: Boolean,
    creditCard: {
      creditCardNumber: { type: String },
      creditCardBrand: { type: String },
      creditCardToken: { type: String }
    },
    discount: {
      value: { type: Number },
      dueDateLimitDays: { type: Number },
      limitedDate: { type: String },
      type: { type: String }
    },
    fine: {
      value: { type: Number },
      type: { type: String }
    },
    interest: {
      value: { type: Number },
      type: { type: String }
    },
    split: [{
      walletId: String,
      fixedValue: Number,
      percentualValue: Number,
      status: String,
      refusalReason: String
    }],
    chargeback: {
      status: String,
      reason: String
    },
    refunds: Schema.Types.Mixed
  }
})

export default model(ModelName, EventSchema)
