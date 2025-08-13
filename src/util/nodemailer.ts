import nodemailer, { type SentMessageInfo } from 'nodemailer'

import { env } from '../.env/index'
import { type mailOptions } from '../config/types/generic-types'

class EmailService {
  private readonly sender: any

  constructor() {
    this.sender = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: parseInt(env.EMAIL_PORT),
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PWD
      }
    })
  }

  getMessage(data: mailOptions) {
    return {
      from: env.EMAIL_SENDER,
      to: data.email,
      subject: '[Resumo Rápido] Redefinir Senha',
      html: this.getHtml(data)
    }
  }

  getHtml(data: mailOptions) {
    return `Olá ${data.name}. <br><br>
    Segue o link para redefinir sua senha: <br><br>
    <a href="https://app.resumorapido.ai/recuperar-senha?token=${data.token}">Acessar link</a><br>`
  }

  async send(data: mailOptions) {
    const message = this.getMessage(data)

    return await new Promise((resolve, reject) => {
      this.sender.sendMail(message, (err: Error | null, res: SentMessageInfo) => {
        if (err !== null) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}

export default new EmailService()
