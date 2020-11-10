import { Request, Response } from 'express'
import dateFormat from 'dateformat'
import ServCelModel from '../../models/ServCel'
import NuageModel from '../../models/Nuage'
import { saveControllerLogs } from '../../helpers/logs'
import { buildXml } from '../../helpers/xml'
import { queryYupSchema } from '../../validation/yup'
import {
  IServCelResponse,
  IServCelInsResponse,
  ITopUpRequest,
  ITopUpResponse,
  IGetAuthResponse
} from '../../interfaces/ServCel'

export const QueryController = (req: Request, res: Response) => {
  saveControllerLogs('INICIO            ', req.body, 'servcelConsulta-controller')

  let statusCode: number = 200
  const response: IServCelResponse = {
    codResposta: '10'
  }

  try {
    queryYupSchema
      .validate(req.body.xml)
      .then(async (body: any) => {
        saveControllerLogs('POS VALID PARAMS  ', body, 'servcelConsulta-controller')

        const servCelResponse: IServCelInsResponse = await ServCelModel.procInsServCel(
          'Consulta',
          200,
          '',
          null,
          body
        )

        saveControllerLogs('POS PROC 200      ', { body, response: servCelResponse }, 'servcelConsulta-controller')

        const checkPlintron = await ServCelModel.procCheckPlintron()

        saveControllerLogs('POS SELECT CHECK  ', { body, response: checkPlintron }, 'servcelConsulta-controller')

        if (body.msisdn.length === 11) {
          saveControllerLogs('POS VALID MSISDN  ', body, 'servcelConsulta-controller')

          if (await NuageModel.procContaNuage(body.msisdn)) {
            saveControllerLogs('POS CONTA NUAGE   ', body, 'servcelConsulta-controller')

            if (checkPlintron) {
              const responseGetAuth: IGetAuthResponse = await ServCelModel.procGetAuth(body.msisdn, body.operadora)

              saveControllerLogs('POS PROC GETAUTH  ', { body, response: responseGetAuth }, 'servcelConsulta-controller')

              const dateNow = new Date()
              const transactionID: string = (
                'SC' +
                servCelResponse.idServCel +
                dateFormat(dateNow, 'yyyymmdhhMMss')
              ).padStart(19, '0')

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

              const responseTopUp: ITopUpResponse = await ServCelModel.procInsPlintron(
                responseGetAuth.authentication,
                requestTopUp
              )

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

        const response210 = await ServCelModel.procInsServCel(
          'Consulta',
          210,
          response.codResposta,
          checkPlintron,
          body
        )

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
