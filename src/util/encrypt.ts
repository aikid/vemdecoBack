import crypto from 'crypto'

import { env } from '../.env'

const algorithm: string = 'aes-256-cbc'

const secretKey: Buffer = Buffer.from(env.SECRET_GATEWAY, 'hex')
const initializationVector: Buffer = Buffer.from(env.SECRET_VECTOR, 'hex')

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, initializationVector)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export const decrypt = (encryptedData: string): string => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, initializationVector)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
