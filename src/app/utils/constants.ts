import 'dotenv/config'

export const APP = {
  URL: process.env.APP_URL || '',
  URI: process.env.APP_URI || '',
  PORT: process.env.PORT || '',
  NODE_ENV: process.env.NODE_ENV || ''
}

export const DB = {
  HOST: process.env.DB_HOST || '',
  PORT: process.env.DB_PORT || '',
  INSTANCENAME: process.env.DB_INSTACENAME || '',
  HUB360_DB: process.env.DB_HUB360_DATABASE || '',
  USERNAME: process.env.DB_USERNAME || '',
  PASSWORD: process.env.DB_PASSWORD || ''
}

export const ELK = {
  SECRET_TOKEN: process.env.ELK_SECRET_TOKEN || '',
  SERVER_URL: process.env.ELK_SERVER_URL || '',
  ENVIRONMENT: process.env.ELK_ENVIRONMENT || ''
}
