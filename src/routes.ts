import { Router } from 'express'

import headerMiddleware from './app/middlewares/header'
import xmlToJsonMiddleware from './app/middlewares/xmlToJson'

import ServCelController from './app/controllers/ServCelController'

const routes = Router()

const uri = process.env.APP_URI

routes.all('*', headerMiddleware, xmlToJsonMiddleware)

routes.route(uri + '/consultaTelefone').post(ServCelController.index)
routes.route(uri + '/recargaTelefone').post(ServCelController.store)

export default routes
