import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '../.env'

class Connect {
  getHeaders (token: string) {
    return {
      Authorization: `Bearer ${token}`
    }
  }

  async start (axiosRequest: AxiosRequestConfig) {
    axiosRequest.headers = this.getHeaders(env.BEARER_TOKEN)
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

export default new Connect()
