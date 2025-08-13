import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import UserValidator from '../validators/user-validator'
import UserServices from '../services/user-services'
import planServices from '../services/plan-services'
import type * as UserTypes from '../config/types/user-types'

class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = UserValidator.create(req.body)
      const user = await UserServices.create(body as UserTypes.createUser)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserServices.getUsers()
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = UserValidator.signin(req.body)
      const user = await UserServices.signin(body as UserTypes.signin)

      if (user === null) return res.status(204).json()

      if (user === false) return res.status(403).json({ message: 'Invalid email or password ' })

      Logger.captureResult(req, user)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await planServices.listActivePlans()

      if (plans.length === 0) {
        return res.status(403).json()
      }

      Logger.captureResult(req, plans)
      return res.json(plans)
    } catch (e) {
      next(e)
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserServices.getUserInfo(req.params.id)
      Logger.captureResult(req, user)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userExists = await UserServices.userExists(req.body._id)

      if (!userExists) {
        return res.status(403).json({ message: 'User not found!' })
      }

      const userUpdate = await UserServices.updateUser(req.body as UserTypes.updateUser)

      Logger.captureResult(req, userUpdate)

      return res.json(userUpdate)
    } catch (e) {
      next(e)
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const params: any = req.query

      const body = UserValidator.getUserByEmail(params)

      const user = await UserServices.getUserByEmail(body.email)

      if (user === null) return res.status(204).json()

      const response = { userId: user._id, name: user.name, email: user.email }

      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController()
