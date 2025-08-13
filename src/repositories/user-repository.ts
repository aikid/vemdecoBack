import user from '../models/user'

import type * as UserTypes from '../config/types/user-types'
import mongoose from 'mongoose'

class UserRepositoties {
  async create(body: UserTypes.createUser) {
    return await user.create(body)
  }

  async findByEmail(email: string) {
    return await user.findOne({ email })
  }

  async findByAll() {
    return await user.find()
  }

  async findByDocument(document: string) {
    return await user.findOne({ document })
  }

  async findById(id: string) {
    return await user.findById(id)
  }

  async findByEmailAndUpdatePassword(email: string, password: string) {
    const query = { email }
    return await user.findOneAndUpdate(query, { $set: { password } })
  }

  async update(body: UserTypes.updateUser) {
    const { _id, ...rest } = body
    const userId = new mongoose.Types.ObjectId(_id)

    const userUpdated = await user.findByIdAndUpdate(
      userId,
      { $set: rest },
      { new: true }
    )
    return userUpdated
  }
}

export default new UserRepositoties()
