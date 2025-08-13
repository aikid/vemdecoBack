interface createAdmin {
  name: string
  email: string
  phone: string
  password: string
}

interface signin {
  email: string
  password: string
}

export type { createAdmin, signin }
