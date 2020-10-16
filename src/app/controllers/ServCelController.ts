import { Request, Response } from 'express'
import dateFormat from 'dateformat'
import xml from 'xml2js'
import * as Yup from 'yup'

import ServCelModel from '../models/ServCel'
import NuageModel from '../models/Nuage'

import { saveControllerLogs } from '../helpers/logs'

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
  public static async index (req: Request, res: Response) {
    saveControllerLogs('INICIO            ', req.body, 'servcelConsulta-controller')

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
          saveControllerLogs('POS VALID PARAMS  ', body, 'servcelConsulta-controller')

          const servCelResponse: IServCelInsResponse = await ServCelModel.procInsServCel('Consulta', 200, '', null, body)
          
          saveControllerLogs('POS PROC 200      ', { body, response: servCelResponse }, 'servcelConsulta-controller')
          
          const checkPlintron = await ServCelModel.procCheckPlintron()
          
          saveControllerLogs('POS SELECT CHECK  ', { body, response: checkPlintron}, 'servcelConsulta-controller')
          
          if (body.msisdn.length === 11) {
            saveControllerLogs('POS VALID MSISDN  ', body, 'servcelConsulta-controller')
           
            if (await NuageModel.procContaNuage(body.msisdn)) {
              saveControllerLogs('POS CONTA NUAGE   ', body, 'servcelConsulta-controller')

              if (checkPlintron) {
                const responseGetAuth: IGetAuthResponse = await ServCelModel.procGetAuth(body.msisdn, body.operadora)

                saveControllerLogs('POS PROC GETAUTH  ', { body, response: responseGetAuth }, 'servcelConsulta-controller')

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

                const responseTopUp: ITopUpResponse = await ServCelModel.procInsPlintron(responseGetAuth.authentication, requestTopUp)
                
                saveControllerLogs('POSPROCINSPLINTRON', { body, response: responseTopUp }, 'servcelConsulta-controller')
                
                if (responseTopUp.code === '00') {
                  response.codResposta = '00'
                } else {
                  response.codResposta = '10'
                }
              } else {
                const responseApi: IServCelResponse = await ServCelModel.procGetCodResposta(body.msisdn, 'Consulta')

                saveControllerLogs('POSPROCCODRESPOSTA', { body, response: responseApi }, 'servcelConsulta-controller')

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

          const response210 = await ServCelModel.procInsServCel('Consulta', 210, response.codResposta, checkPlintron, body)

          saveControllerLogs('POS PROC 210      ', { body, response: response210 }, 'servcelConsulta-controller')
          
          saveControllerLogs('FIM               ', body, 'servcelConsulta-controller')

          return res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })
        })
        .catch((err: any) => {
          saveControllerLogs('ERROR            ', { body: req.body, error: err.toString() }, 'servcelConsulta-controller')

          statusCode = 400
          console.log(err)

          return res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })
        })
    } catch (err) {
      saveControllerLogs('ERROR            ', { body: req.body, error: err.toString() }, 'servcelConsulta-controller')

      statusCode = 400
      console.log(err)

      return res.format({
        'application/xml': () => {
          res.status(statusCode).send(buildXml(response.codResposta))
        }
      })
    }
  }

  public static async store (req: Request, res: Response) {
    saveControllerLogs('INICIO            ', req.body, 'servcelRecarga-controller')

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
          saveControllerLogs('POS VALID PARAMS  ', body, 'servcelRecarga-controller')
          
          const servCelResponse: IServCelInsResponse = await ServCelModel.procInsServCel('Recarga', 200, '', null, body)
          
          saveControllerLogs('POS PROC 200      ', { body, response: servCelResponse}, 'servcelRecarga-controller')
          
          const checkPlintron = await ServCelModel.procCheckPlintron()
          
          saveControllerLogs('POS SELECT CHECK  ', { body, response: checkPlintron}, 'servcelRecarga-controller')
          
          if (body.msisdn.length === 11) {
            saveControllerLogs('POS VALID MSISDN  ', body, 'servcelRecarga-controller')
            
            if (await NuageModel.procContaNuage(body.msisdn)) {
              saveControllerLogs('POS CONTA NUAGE   ', body, 'servcelRecarga-controller')
              
              if (checkPlintron) {
                const responseGetAuth: IGetAuthResponse = await ServCelModel.procGetAuth(body.msisdn, body.operadora)
                saveControllerLogs('POS PROC GETAUTH  ', { body, response: responseGetAuth }, 'servcelRecarga-controller')

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

                const responseTopUp: ITopUpResponse = await ServCelModel.procInsPlintron(responseGetAuth.authentication, requestTopUp)
                
                saveControllerLogs('POSPROCINSPLINTRON', { body, response: responseTopUp }, 'servcelRecarga-controller')
                
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
                  
                  const responseNuage = await NuageModel.procRecargaNuage(requestRecarga)
                  
                  saveControllerLogs('POS PROC 210      ', { body, response: responseNuage }, 'servcelRecarga-controller')

                  saveControllerLogs('FIM               ', body, 'servcelRecarga-controller')
                } else {
                  response.codResposta = '10'
                }
              } else {
                if (servCelResponse.code === '01') {
                  response.codResposta = servCelResponse.code
                } else {
                  const responseApi: IServCelResponse = await ServCelModel.procGetCodResposta(body.msisdn, 'Recarga')

                  saveControllerLogs('POSPROCCODRESPOSTA', { body, response: responseApi }, 'servcelRecarga-controller')

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

          await ServCelModel.procInsServCel('Recarga', 210, response.codResposta, checkPlintron, body)

          return res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })
        })
        .catch((err: any) => {
          saveControllerLogs('ERROR            ', { body: req.body, error: err.toString() }, 'servcelRecarga-controller')

          statusCode = 400
          console.log(err)

          return res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(response.codResposta))
            }
          })
        })
    } catch (err) {
      saveControllerLogs('ERROR            ', { body: req.body, error: err.toString() }, 'servcelRecarga-controller')

      statusCode = 400
      console.log(err)

      return res.format({
        'application/xml': () => {
          res.status(statusCode).send(buildXml(response.codResposta))
        }
      })
    }
  }
}

export default ServCelController
