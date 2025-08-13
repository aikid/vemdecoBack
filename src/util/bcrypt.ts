import { hashSync, compareSync } from 'bcrypt'

const SALT_ROUNDS: number = 10

const encryptPassword = (pwd: string): string => {
  return hashSync(pwd, SALT_ROUNDS)
}

const comparePassword = (pwd: string, hash: string): boolean => {
  return compareSync(pwd, hash)
}

export { encryptPassword, comparePassword }
