import path from 'path'
import { createWriteStream } from 'fs'
import dateFormat from 'dateformat'
import { logger } from '../../config/logger/logger'

function logBuilder (data: string, requestExtraData = {}) {
  const headerDate = new Date()
  headerDate.setHours(headerDate.getHours() - 3)

  return `${headerDate.toISOString().replace(/[TZ]/g, ' ')}- ${data} | Request: ${JSON.stringify(requestExtraData)}\n`
}

function saveControllerLogs (dataToSave: string, requestExtraData = {}, controller: string, level = 'info') {
  logger.log(level, { message: dataToSave, body: requestExtraData, controller })

  // const today = dateFormat(new Date(), 'yyyy-mm-dd')

  // const ControllerLogsPath = path.resolve(__dirname, '..', '..', '..', 'logs', controller, `${today}.log`)

  // const stream = createWriteStream(ControllerLogsPath, {
  //   flags: 'a'
  // })

  // stream.on('open', () => {
  //   stream.write(logBuilder(dataToSave, requestExtraData))
  //   stream.close()
  // })
}

export { saveControllerLogs }
