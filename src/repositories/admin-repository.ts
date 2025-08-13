import admin from '../models/admin'

import type * as AdminTypes from '../config/types/admin-types'

class AdminRepositoties {
  async create(body: AdminTypes.createAdmin) {
    return await admin.create(body)
  }

  async findByEmail(email: string) {
    return await admin.findOne({ email })
  }
}

export default new AdminRepositoties()
