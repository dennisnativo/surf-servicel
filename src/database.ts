import { Sequelize } from 'sequelize'

import {
  configDatabase as hub360configDatabase,
  database as hub360database,
  username as hub360username,
  password as hub360password
} from './config/databases/Hub360'

const sequelizeHub360 = new Sequelize(hub360database, hub360username, hub360password, hub360configDatabase)

export default sequelizeHub360
