import type * as UserTypes from '../config/types/user-types'
import { prisma } from '../prisma'

class UserRepositoties {
  async create(body: UserTypes.createUser) {
    return prisma.user.create(body)
  }

  async findByEmail(email: string) {
    return prisma.user.findOne({ email })
  }

  async findByAll() {
    return prisma.user.find()
  }

  async findByDocument(document: string) {
    return prisma.user.findOne({ document })
  }

  async findById(id: string) {
    return prisma.user.findById(id)
  }

  async findByEmailAndUpdatePassword(email: string, password: string) {
    const query = { email }
    return prisma.user.findOneAndUpdate(query, { $set: { password } })
  }

  async update(body: UserTypes.updateUser) {
    const { id, ...rest } = body

    const userUpdated = prisma.user.findByIdAndUpdate(
      id,
      { $set: rest },
      { new: true }
    )
    return userUpdated
  }
}

export default new UserRepositoties()
