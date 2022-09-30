import 'dotenv/config';

import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bodyParserXml from 'express-xml-bodyparser';
import sequelize from './database';
import routes from './routes';

class App {
  server: Express;

  constructor() {
    this.server = express();
    this.init();
  }

  async init() {
    try {
      if (process.env.NODE_ENV !== 'test') {
        sequelize
          .authenticate()
          .then(() => {
            process.env.NODE_ENV === 'development' &&
              console.log('Conexão ao banco Hub360 realizada com sucesso');
          })
          .catch((err: any) => {
            process.env.NODE_ENV === 'development' &&
              console.log('Erro na conexão: ', err.message);
          });
      }

      this.middlewares();
      this.routes();
    } catch (err) {
      console.log(err, '\n Server failed to init');
    }
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParserXml());
  }

  routes() {
    const uri = process.env.APP_URI;

    this.server.use(`${uri}`, routes);
  }
}

export default new App().server;
