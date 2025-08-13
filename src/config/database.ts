import mongoose from 'mongoose'

import { env } from '../.env'

class DatabaseConnection {
  constructor() {
    void this.init()
  }

  async init() {
    await mongoose.connect(this.getStringConnection())
      .then(res => {
        console.log('Database connected')
      })
      .catch(e => {
        console.log('Failed to connect database:', e.message)
      })
  }

  getStringConnection() {
    const stringConnection = env.DB_URL.replace('<db_user>', env.DB_USER).replace('<db_password>', env.DB_PWD)
    return stringConnection
  }
}

export default new DatabaseConnection()
