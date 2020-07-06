import 'dotenv/config'

import express from 'express'
import { Express } from 'express-serve-static-core'
import cors from 'cors'
import bodyParser from 'body-parser'
import sequelize from './database'
import routes from './routes'

class App {
  server: Express

  constructor () {
    this.server = express()
    this.init()
  }

  async init () {
    try {
      if (process.env.NODE_ENV !== 'test') {
        sequelize.authenticate()
          .then(() => {
            process.env.NODE_ENV === 'development' && console.log('Conexão ao banco Hub360 realizada com sucesso')
          })
          .catch((err: any) => {
            process.env.NODE_ENV === 'development' && console.log('Erro na conexão: ', err.message)
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
    this.server.use(bodyParser.urlencoded({ extended: true }))
    this.server.use(express.json())
  }

  routes () {
    this.server.use(routes)
  }
}

export default new App().server
