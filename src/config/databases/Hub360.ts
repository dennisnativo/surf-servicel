import { Options } from 'sequelize/types'

export const database: string = process.env.DB_HUB360_DATABASE || ''

export const username: string = process.env.DB_USERNAME || ''
export const password: string = process.env.DB_PASSWORD || ''

export const configDatabase: Options = {
  dialect: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '0'),
  dialectOptions: {
    instanceName: process.env.DB_INSTANCENAME
  },
  database: database
}
