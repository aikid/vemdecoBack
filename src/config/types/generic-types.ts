type typeUser = 'user' | 'admin'

interface sendEmail {
  email: string
  type: typeUser
}

interface tokenToUpdatePwd {
  userId: string
  name: string
  email: string
  token: string
  updated: boolean
}

interface mailOptions {
  name: string
  email: string
  token: string
}

interface updatePassword {
  token: string
  password: string
}

export type { sendEmail, tokenToUpdatePwd, mailOptions, updatePassword }
