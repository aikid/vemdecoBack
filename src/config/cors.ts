import { type NextFunction, type Request, type Response } from 'express'

interface typeOrigin {
  origin: string[]
}

export const corsOptions: typeOrigin = {
  origin: ['http://187.61.200.209', 'http://179.190.201.53', 'https://app.resumorapido.ai/']
}

export const allowOriginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*') // Define o cabeçalho Access-Control-Allow-Origin
  next()
}
