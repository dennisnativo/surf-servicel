import { Router } from 'express'

import { logsStart, logsEnd } from 'pagtel-logapi'

import headerMiddleware from './app/middlewares/header'

import ServCelController from './app/controllers/ServCelController'

const routes = Router()

const uri = process.env.APP_URI

routes.all('*', logsStart)

routes.all('*', headerMiddleware)

routes.route(uri + '/consultaTelefone')
  .post(ServCelController.index)

// routes.route(uri + '/recargaTelefone')
//   .post(ServCelController.store)

routes.all('*', logsEnd)

export default routes
