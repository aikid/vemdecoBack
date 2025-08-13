import { Router, type Request, type Response } from 'express'

const notFoundRoutes = Router()

notFoundRoutes.use((req: Request, res: Response) => {
  return res.status(404).json({
    status: 404,
    message: 'Route not found'
  })
})

export default notFoundRoutes
