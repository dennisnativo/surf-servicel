import { Router } from 'express'

import headerMiddleware from './app/middlewares/header'
import xmlToJsonMiddleware from './app/middlewares/xmlToJson'
import { QueryController, RechargeController } from './app/controllers/servcell'

const routes = Router()

routes.all('*', headerMiddleware, xmlToJsonMiddleware)

routes.route('/consultaTelefone').post(QueryController)
routes.route('/recargaTelefone').post(RechargeController)

export default routes
