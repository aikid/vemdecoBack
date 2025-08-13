import * as jwt from 'jsonwebtoken'

import { env } from '../.env'
import { type subscriptionSignin } from '../config/types/subscription-types'

class TokenServices {
  generate(id: string, name: string, email: string, userType: string, subscription: subscriptionSignin | null, gatewayCustomerId: string | null) {
    const SECRET_KEY: string = userType === 'admin' ? env.SECRET_ADM_KEY : env.SECRET_USR_KEY
    const PARAMS = userType === 'admin' ? { id, name } : { id, name, email, subscription, gatewayCustomerId }
    const token = jwt.sign(PARAMS, SECRET_KEY, { expiresIn: '12h' })
    return token
  }

  updatePassword(email: string) {
    const token = jwt.sign({ email, date: Date.now() }, env.SECRET_UPD_PWD, {
      expiresIn: '1h'
    })
    return token
  }

  decodeJwt(token: string, secret: string) {
    const decoded = jwt.verify(token, secret)
    return decoded
  }
}

export default new TokenServices()
