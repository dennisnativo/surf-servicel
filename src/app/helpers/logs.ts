import path from 'path'
import { createWriteStream } from 'fs'
import dateFormat = require('dateformat')

function logBuilder (data: string, requestExtraData = {}) {
  const headerDate = new Date()
  headerDate.setHours(headerDate.getHours() - 3)

  return `${headerDate.toISOString().replace(/[TZ]/g, ' ')}- ${data} | Request: ${JSON.stringify(requestExtraData)}\n`
}

function saveControllerLogs (dataToSave: string, requestExtraData = {}, controller: string) {
  const today = dateFormat(new Date(), 'yyyy-mm-dd')

  const ControllerLogsPath = path.resolve(__dirname, '..', '..', '..', 'logs', controller, `${today}.log`)

  const stream = createWriteStream(ControllerLogsPath, {
    flags: 'a'
  })

  stream.on('open', () => {
    stream.write(logBuilder(dataToSave, requestExtraData))
    stream.close()
  })
}

export { saveControllerLogs }
