import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '../.env'

class GatewayConnect {
  getHeaders () {
    return {
      access_token: env.ASAAS_TOKEN,
      'content-type': 'application/json'
    }
  }

  async start (axiosRequest: AxiosRequestConfig) {
    axiosRequest.headers = this.getHeaders()

    const response = await axios(axiosRequest).then(res => {
      if (res.status === 200) {
        return res.data
      }
      throw new Error('Failed to process request')
    }).catch((err: Error) => {
      throw new Error(err.message)
    })

    return response
  }
}

export default new GatewayConnect()
