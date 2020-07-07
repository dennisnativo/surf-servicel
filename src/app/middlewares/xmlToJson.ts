import { Request, Response, NextFunction } from 'express'

import { IServCelResponse, IServCelRequest } from '../interfaces/ServCel'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: IServCelRequest = {
      msisdn: '',
      valor: '',
      origem: '',
      dataOrigem: '',
      dataServCel: '',
      nsuOrigem: '',
      nsuServCel: '',
      produto: '',
      chave: '',
      operadora: ''
    }

    const body = req.body.methodcall.params[0].member
    body.map((item: any) => {
      switch (item.name[0]) {
        case 'msisdn':
          request.msisdn = item.value[0]
          break
        case 'valor':
          request.valor = item.value[0]
          break
        case 'origem':
          request.origem = item.value[0]
          break
        case 'dataOrigem':
          request.dataOrigem = item.value[0]
          break
        case 'dataServCel':
          request.dataServCel = item.value[0]
          break
        case 'nsuOrigem':
          request.nsuOrigem = item.value[0]
          break
        case 'nsuServCel':
          request.nsuServCel = item.value[0]
          break
        case 'produto':
          request.produto = item.value[0]
          break
        case 'chave':
          request.chave = item.value[0]
          break
        case 'operadora':
          request.operadora = item.value[0]
          break
      }
    })

    req.body.xml = request

    return next()
  } catch (err) {
    const response: IServCelResponse = {
      codResposta: '10'
    }

    req.body.objRes = {
      statusCode: 401,
      response
    }

    console.log(err)
    return res.status(401).json(response)
  }
}
