import { Router, type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import AdminController from '../controllers/admin-controller'
import Admin from '../middlewares/admin'
import Private from '../middlewares/private'

const adminRoutes = Router()

adminRoutes.use(Logger.preHandler)

adminRoutes.post('/admin/create', Admin.private, AdminController.create)
adminRoutes.post('/admin/signin', AdminController.signin)

adminRoutes.post('/admin/create-plan', Private.admin, AdminController.createPlan)
adminRoutes.get('/admin/list-plans', Private.admin, AdminController.listPlans)
adminRoutes.patch('/admin/update-plan', Private.admin, AdminController.updatePlan)

adminRoutes.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    Logger.captureException(req, err)
    const message = JSON.parse(err.message)
    return res.status(400).json({
      status: 400,
      message
    })
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: err.message
    })
  }
})

export default adminRoutes
