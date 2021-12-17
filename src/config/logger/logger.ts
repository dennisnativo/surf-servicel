import { createLogger, transports } from 'winston'
import ecsFormat from '@elastic/ecs-winston-format'

export const logger = createLogger({
  level: 'debug',
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new transports.File({
      filename: 'logs/servcel.log',
      level: 'debug'
    })
  ]
})
