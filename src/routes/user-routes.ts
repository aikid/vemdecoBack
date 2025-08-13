import { Router, type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import Private from '../middlewares/private'
import UserController from '../controllers/user-controller'
import GenericController from '../controllers/generic-controller'
import SubscriptionController from '../controllers/subscription-controller'
import NotificationController from '../controllers/notification-controller'
import PromptController from '../controllers/prompt-controller'
import AdminController from '../controllers/admin-controller'

const userRoutes = Router()

userRoutes.use(Logger.preHandler)

userRoutes.post('/user/create', UserController.create)
userRoutes.post('/user/signin', UserController.signin)
userRoutes.post('/user/send-email', GenericController.sendEmail)
userRoutes.post('/user/update-password', GenericController.updatePassword)
userRoutes.get('/user/get-states', GenericController.getUserState)

userRoutes.get('/user/list', Private.user, UserController.list)
userRoutes.get('/user/payments', Private.user, AdminController.getPayments)
userRoutes.get('/user/list-plans', Private.user, UserController.listPlans)
userRoutes.get('/user/get-info', Private.user, UserController.getUserInfo)
userRoutes.post('/user/update-profile', Private.user, UserController.update)
userRoutes.get('/user/get-user-by-email', Private.user, UserController.getUserByEmail)

userRoutes.get('/user/find-subscription', Private.user, SubscriptionController.find)
userRoutes.get('/user/check-active-subscription', Private.user, SubscriptionController.checkAtiveSubscription)
userRoutes.post('/user/create-subscription', Private.user, SubscriptionController.create)
userRoutes.post('/user/update-subscription', Private.user, SubscriptionController.updateSubscription)
userRoutes.get('/user/get-payment-link', Private.user, SubscriptionController.getPaymentLink)
userRoutes.post('/user/bind-subscription', Private.user, SubscriptionController.bindSubscription)
userRoutes.delete('/user/delete-subscription', Private.user, SubscriptionController.deleteSubscription)

userRoutes.get('/user/find-notification', Private.user, NotificationController.findAllNotifications)
userRoutes.post('/user/create-notification', Private.user, NotificationController.create)
userRoutes.patch('/user/update-notification', Private.user, NotificationController.updateNotification)

userRoutes.post('/user/create-prompt', Private.user, PromptController.createPrompt)
userRoutes.get('/user/get-user-prompts', Private.user, PromptController.getUserPrompts)
userRoutes.patch('/user/update-prompt', Private.user, PromptController.updatePrompt)
userRoutes.patch('/user/set-default-prompt', Private.user, PromptController.setDefaultPrompt)

userRoutes.use('/ping', (req: Request, res: Response) => {
  return res.json({ pong: true })
})

userRoutes.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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

export default userRoutes
