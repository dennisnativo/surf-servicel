/* eslint-disable import/first */
import { ElasticAPM } from './app/infra/observability/apm'
ElasticAPM.getInstance()

import app from './app'
import { APP } from './app/utils/constants'

const PORT = APP.PORT
app.listen(PORT, () => { console.log(`Listening on ${PORT}`) })
