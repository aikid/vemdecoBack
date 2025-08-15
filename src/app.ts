import express, { type Application } from 'express'
import cors from 'cors'

import { createServer, type Server } from 'http'
import { WebSocketServer, type WebSocket } from 'ws'

import adminRoutes from './routes/admin-routes'
import userRoutes from './routes/user-routes'
import transcribeRoutes from './routes/transcribe-routes'
import notFoundRoutes from './routes/not-found-routes'
import gatewayRoutes from './routes/gateway-routes'
import updateSubscriptionWithoutPayments from './schedulers/update-subscriptions-without-payments'
import updateSubscriptionCanceled from './schedulers/update-subscriptions-canceled'
import updateSubscriptionWithoutPaymentConfirmed from './schedulers/update-subscriptions-without-payment-confirmed'

class App {
  public server: Application
  public httpServer: Server
  private readonly wss: WebSocketServer

  constructor() {
    this.server = express()
    this.httpServer = createServer(this.server)
    this.wss = new WebSocketServer({ server: this.httpServer })

    this.middlewares()
    this.routes()
    this.webSocketSetup()
    this.schedulers()
  }

  private middlewares() {
    this.server.use(express.json())
    this.server.use(cors())
  }

  private routes() {
    this.server.use(adminRoutes)
    this.server.use(userRoutes)
    this.server.use(transcribeRoutes)
    this.server.use(gatewayRoutes)
    this.server.use(notFoundRoutes)
  }

  private webSocketSetup() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected')

      ws.on('message', (message: string) => {
        console.log(`Received: ${message}`)
        ws.send(`Hello, you sent -> ${message}`)
      })

      ws.on('close', () => {
        console.log('Client has disconnected')
      })
    })
  }

  private schedulers() {
    updateSubscriptionWithoutPayments.start()
    updateSubscriptionCanceled.start()
    updateSubscriptionWithoutPaymentConfirmed.start()
  }
}

export default new App().httpServer
