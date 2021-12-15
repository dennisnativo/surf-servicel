import express, { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bodyParserXml from 'express-xml-bodyparser'
import sequelize from './database'
import routes from './routes'
import { APP } from './app/utils/constants'

class App {
  server: Express

  constructor () {
    this.server = express()
    this.init()
  }

  async init () {
    try {
      if (APP.NODE_ENV !== 'test') {
        sequelize.authenticate()
          .then(() => {
            APP.NODE_ENV === 'development' && console.log('Conexão ao banco Hub360 realizada com sucesso')
          })
          .catch((err: any) => {
            APP.NODE_ENV === 'development' && console.log('Erro na conexão: ', err.message)
          })
      }

      this.middlewares()
      this.routes()
    } catch (err) {
      console.log(err, '\n Server failed to init')
    }
  }

  middlewares () {
    this.server.use(cors())
    this.server.use(express.json())
    this.server.use(bodyParser.urlencoded({ extended: true }))
    this.server.use(bodyParserXml())
  }

  routes () {
    const uri = APP.URI

    this.server.use(`${uri}`, routes)
  }
}

export default new App().server
