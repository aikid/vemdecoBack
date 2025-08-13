import { decrypt } from './encrypt'

import type * as BillingTypes from '../config/types/billing-types'

const normalizeCardNumber = (cardNumber: string) => {
  cardNumber = decrypt(cardNumber)
  return '...' + cardNumber.slice(cardNumber.length - 4)
}

export const maskBillings = (row: BillingTypes.BillingMethods) => {
  return {
    id: row._id,
    cardNumber: normalizeCardNumber(row.cardNumber),
    expiryMonth: decrypt(row.expiryMonth),
    expiryYear: decrypt(row.expiryYear),
    default: row.default
  }
}
