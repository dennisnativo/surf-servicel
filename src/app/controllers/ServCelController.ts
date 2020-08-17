import { Request, Response, NextFunction } from 'express'
import dateFormat from 'dateformat'
import xml from 'xml2js'
import * as Yup from 'yup'

import ServCelModel from '../models/ServCel'

import { IServCelResponse, IServCelInsResponse, ITopUpRequest, ITopUpResponse, IGetAuthResponse, IRecargaRequest } from '../interfaces/ServCel'

const buildXml = (value: string): string => {
  const builder = new xml.Builder({
    renderOpts: { pretty: false }
  })

  return builder.buildObject({
    methodResponse: {
      params: {
        member: {
          name: 'codResposta',
          value: value
        }
      }
    }
  })
}

class ServCelController {
  public static async index (req: Request, res: Response, next: NextFunction) {
    let statusCode: number = 200
    const response: IServCelResponse = {
      codResposta: '10'
    }

    try {
      const schema = Yup.object().shape({
        msisdn: Yup.string().required('MSISDN é obrigatório'),
        valor: Yup.string().required('Valor é obrigatório'),
        origem: Yup.string().required('Origem é obrigatório'),
        produto: Yup.string().required('Produto é obrigatório'),
        operadora: Yup.string().required('Operadora é obrigatório')
      })

      schema.validate(req.body.xml)
        .then(async (body: any) => {
          const servCelResponse: IServCelInsResponse = await ServCelModel.procInsServCel('Consulta', 200, '', null, body)

          const checkPlintron = await ServCelModel.procCheckPlintron()

          if (body.msisdn.length === 11) {
            if (await ServCelModel.procNuage(body.msisdn)) {
              if (checkPlintron) {
                const responseGetAuth: IGetAuthResponse = await ServCelModel.procGetAuth(body.msisdn, body.operadora)

                const dateNow = new Date()
                const transactionID: string = ('SC' + servCelResponse.idServCel + dateFormat(dateNow, 'yyyymmdhhMMss')).padStart(19, '0')

                const requestTopUp: ITopUpRequest = {
                  productID: responseGetAuth.plintronProductId,
                  MSISDN: '55' + body.msisdn,
                  amount: body.valor.replace(',', ''),
                  transactionID,
                  terminalID: '02SV',
                  currency: 'BRL',
                  cardID: 'Card',
                  retailerID: 'MGM',
                  twoPhaseCommit: '0'
                }

                const responseTopUp: ITopUpResponse = await ServCelModel.procTopUp(responseGetAuth.authentication, requestTopUp)

                if (responseTopUp.code === '00') {
                  response.codResposta = '00'
                } else {
                  response.codResposta = '10'
                }
              } else {
                const responseApi: IServCelResponse = await ServCelModel.procGetCodResposta(body.msisdn, 'Consulta')

                if (responseApi) {
                  response.codResposta = responseApi.codResposta
                }
              }
            } else {
              response.codResposta = '12'
            }
          } else {
            response.codResposta = '12'
          }

          req.body.objRes = {
            statusCode,
            response
          }

          res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })

          await ServCelModel.procInsServCel('Consulta', 210, response.codResposta, checkPlintron, body)

          return next()
        })
        .catch((err: any) => {
          statusCode = 400
          console.log(err)

          req.body.objRes = {
            statusCode,
            response
          }

          res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })

          return next()
        })
    } catch (err) {
      statusCode = 400
      console.log(err)

      req.body.objRes = {
        statusCode,
        response
      }

      res.format({
        'application/xml': () => {
          res.status(statusCode).send(buildXml(response.codResposta))
        }
      })

      return next()
    }
  }

  public static async store (req: Request, res: Response, next: NextFunction) {
    let statusCode: number = 200
    const response: IServCelResponse = {
      codResposta: '10'
    }

    try {
      const schema = Yup.object().shape({
        msisdn: Yup.string().required('MSISDN é obrigatório'),
        valor: Yup.string().required('Valor é obrigatório'),
        origem: Yup.string().required('Origem é obrigatório'),
        dataOrigem: Yup.string().required('Data de origem é obrigatório'),
        dataServCel: Yup.string().required('Data da transação é obrigatório'),
        nsuOrigem: Yup.string().required('NSU de origem é obrigatório'),
        nsuServCel: Yup.string().required('NSU da transação é obrigatório'),
        produto: Yup.string().required('Produto é obrigatório'),
        chave: Yup.string().required('Chave é obrigatório'),
        operadora: Yup.string().required('Operadora é obrigatório')
      })

      schema.validate(req.body.xml)
        .then(async (body: any) => {
          const servCelResponse: IServCelInsResponse = await ServCelModel.procInsServCel('Recarga', 200, '', null, body)

          const checkPlintron = await ServCelModel.procCheckPlintron()

          if (body.msisdn.length === 11) {
            if (await ServCelModel.procNuage(body.msisdn)) {
              if (checkPlintron) {
                const responseGetAuth: IGetAuthResponse = await ServCelModel.procGetAuth(body.msisdn, body.operadora)

                const dateNow = new Date()
                const transactionID: string = ('SC' + servCelResponse.idServCel + dateFormat(dateNow, 'yyyymmdhhMMss')).padStart(19, '0')

                const requestTopUp: ITopUpRequest = {
                  productID: responseGetAuth.plintronProductId,
                  MSISDN: '55' + body.msisdn,
                  amount: body.valor.replace(',', ''),
                  transactionID,
                  terminalID: '02SV',
                  currency: 'BRL',
                  cardID: 'Card',
                  retailerID: 'MGM',
                  twoPhaseCommit: '1'
                }

                const responseTopUp: ITopUpResponse = await ServCelModel.procTopUp(responseGetAuth.authentication, requestTopUp)
                console.log('TOPUP: ', responseTopUp)
                if (responseTopUp.code === '00') {
                  response.codResposta = '00'

                  // Recarga Nuage ********************************************
                  const requestRecarga: IRecargaRequest = {
                    msisdn: '55' + body.msisdn,
                    valor: body.valor.replace(',', ''),
                    dtExecucao: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
                    origem: 'ServCel',
                    nsu: responseTopUp.transactionID
                  }

                  await ServCelModel.procRecargaNuage(requestRecarga)
                } else {
                  response.codResposta = '10'
                }
              } else {
                if (servCelResponse.code === '01') {
                  response.codResposta = servCelResponse.code
                } else {
                  const responseApi: IServCelResponse = await ServCelModel.procGetCodResposta(body.msisdn, 'Recarga')

                  if (responseApi) {
                    response.codResposta = responseApi.codResposta
                  }
                }
              }
            } else {
              response.codResposta = '12'
            }
          } else {
            response.codResposta = '12'
          }

          req.body.objRes = {
            statusCode,
            response
          }

          res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })

          await ServCelModel.procInsServCel('Recarga', 210, response.codResposta, checkPlintron, body)

          return next()
        })
        .catch((err: any) => {
          statusCode = 400
          console.log(err)

          req.body.objRes = {
            statusCode,
            response
          }

          res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })

          return next()
        })
    } catch (err) {
      statusCode = 400
      console.log(err)

      req.body.objRes = {
        statusCode,
        response
      }

      res.format({
        'application/xml': () => {
          res.status(statusCode).send(buildXml(response.codResposta))
        }
      })

      return next()
    }
  }
}

export default ServCelController
