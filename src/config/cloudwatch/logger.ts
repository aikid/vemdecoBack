import winston from 'winston'
import WinstonCloudWatch from 'winston-cloudwatch'
import { env } from '../../.env'

const createLogger = (customerName: string) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss'
      }),
      winston.format.json()
    ),
    transports: [
      new WinstonCloudWatch({
        logGroupName: env.LOG,
        logStreamName: customerName,
        awsRegion: 'sa-east-1',
        jsonMessage: true
      })
    ]
  })
}

export default createLogger
