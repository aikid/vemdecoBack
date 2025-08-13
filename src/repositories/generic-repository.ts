import type * as GenericTypes from '../config/types/generic-types'
import userPwd from '../models/userpwd'
import state from '../models/state'
class GenericRepositories {
  async createUserRequestToUpdatePwd(body: GenericTypes.tokenToUpdatePwd) {
    return await userPwd.create(body)
  }

  async findUserRequestToUpdatePwd(token: string, status: boolean) {
    return await userPwd.findOne({ token, updated: status })
  }

  async updateUserRequestToUpdatePwd(token: string) {
    const query = { token }
    return await userPwd.findOneAndUpdate(query, { $set: { updated: true } })
  }

  async findAllStates() {
    return await state.find()
  }
}

export default new GenericRepositories()
