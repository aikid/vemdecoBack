type typeUser = 'pf' | 'pj'

interface createUser {
  name: string
  email: string
  phone: string
  password: string
  type: typeUser
  document: string
  gatewayCustomerId: string
}

interface updateUser {
  id: string
  name: string
  email: string
  phone: string
  type: string
  document: string
  occupation: string
  zipCode: string
  state: string
  city: string
  address: string
  number: string
  complement: string
  neighborhood: string
  birthdate: string
  secondPhone: string
}

interface signin {
  email: string
  password: string
}

interface updatePassword {
  email: string
}

export type { createUser, signin, updatePassword, updateUser }
