import { DB } from '../../app/utils/constants'
import { Options } from 'sequelize/types'

export const database: string = DB.HUB360_DB || ''

export const username: string = DB.USERNAME || ''
export const password: string = DB.PASSWORD || ''

export const configDatabase: Options = {
  dialect: 'mssql',
  host: DB.HOST,
  port: parseInt(DB.PORT || '0'),
  dialectOptions: {
    instanceName: DB.INSTANCENAME
  },
  database: database
}
