import { Request, Response } from 'express'
import dateFormat from 'dateformat'
import ServCelModel from '../../models/ServCel'
import NuageModel from '../../models/Nuage'
import { saveControllerLogs } from '../../helpers/logs'
import {
  IServCelResponse,
  IServCelInsResponse,
  ITopUpRequest,
  ITopUpResponse,
  IGetAuthResponse,
  IRecargaRequest
} from '../../interfaces/ServCel'
import { buildXml } from '../../helpers/xml'
import { rechargeYupSchema } from '../../validation/yup'

interface NuageRequestsValues {
  rechargeValue: string;
  creditValue: string;
}

const INTER_BANK_ORIGIN = '6302'

const isInterRecharge40WithDiscount = (value: string, origin: string) =>
  (value === '10800' || value === '10200') && origin === INTER_BANK_ORIGIN
const isInterRecharge50WithDiscount = (value: string, origin: string) =>
  (value === '13500' || value === '12750') && origin === INTER_BANK_ORIGIN
const isInterRecharge75WithDiscount = (value: string, origin: string) =>
  (value === '20250' || value === '19125') && origin === INTER_BANK_ORIGIN

const nuageRequests = (body: any, responseTopUp: any) => async ({
  rechargeValue,
  creditValue
}: NuageRequestsValues) => {
  const dtExecucao = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')

  const responseNuage = await NuageModel.procRecargaNuage({
    msisdn: '55' + body.msisdn,
    valor: rechargeValue,
    dtExecucao,
    origem: 'ServCel',
    nsu: responseTopUp.transactionID
  })

  saveControllerLogs(
    'POS RECARGA NUAGE ',
    { body, response: responseNuage },
    'servcelRecarga-controller'
  )

  const responseCredit = await NuageModel.addCredit({
    msisdn: '55' + body.msisdn,
    valor: creditValue,
    dtExecucao,
    origem: 'ServCel',
    nsu: responseTopUp.transactionID
  })

  saveControllerLogs(
    'POS ADD CREDIT NUAGE ',
    { body, response: responseCredit },
    'servcelRecarga-controller'
  )
}

export const RechargeController = (req: Request, res: Response) => {
  saveControllerLogs(
    'INICIO            ',
    req.body,
    'servcelRecarga-controller'
  )

  let statusCode: number = 200
  const response: IServCelResponse = {
    codResposta: '10'
  }

  try {
    rechargeYupSchema
      .validate(req.body.xml)
      .then(async (body: any) => {
        saveControllerLogs(
          'POS VALID PARAMS  ',
          body,
          'servcelRecarga-controller'
        )

        const servCelResponse: IServCelInsResponse = await ServCelModel.procInsServCel(
          'Recarga',
          200,
          '',
          null,
          body
        )

        saveControllerLogs(
          'POS PROC 200      ',
          { body, response: servCelResponse },
          'servcelRecarga-controller'
        )

        const checkPlintron = await ServCelModel.procCheckPlintron()

        saveControllerLogs(
          'POS SELECT CHECK  ',
          { body, response: checkPlintron },
          'servcelRecarga-controller'
        )

        // Perdoai qualquer coisa, código ruim se resolve com mais código ruim.
        // Quebra o fluxo atual e responde para os caras que jé processamos a solicitação.
        if (servCelResponse.code === '01') {
          return res.format({
            'application/xml': () => {
              res.status(statusCode).send(buildXml(servCelResponse.code))
            }
          })
        }

        if (body.msisdn.length === 11) {
          saveControllerLogs(
            'POS VALID MSISDN  ',
            body,
            'servcelRecarga-controller'
          )

          if (await NuageModel.checkIfNumberCanBeRefilled({ msisdn: body.msisdn, valor: body.valor })) {
            saveControllerLogs(
              'POS CONTA NUAGE   ',
              body,
              'servcelRecarga-controller'
            )

            if (checkPlintron) {
              const responseGetAuth: IGetAuthResponse = await ServCelModel.procGetAuth(
                body.msisdn,
                body.operadora
              )
              saveControllerLogs(
                'POS PROC GETAUTH  ',
                { body, response: responseGetAuth },
                'servcelRecarga-controller'
              )

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
                twoPhaseCommit: '1'
              }

              const responseTopUp: ITopUpResponse = await ServCelModel.procInsPlintron(
                responseGetAuth.authentication,
                requestTopUp
              )

              saveControllerLogs(
                'POSPROCINSPLINTRON',
                { body, response: responseTopUp },
                'servcelRecarga-controller'
              )

              if (responseTopUp.code === '00') {
                response.codResposta = '00'

                const stringRechargeValue = `${body.valor.replace(',', '')}`
                const rechargeOrigin = `${body.origem}`

                const requests = nuageRequests(body, responseTopUp)

                if (
                  isInterRecharge40WithDiscount(
                    stringRechargeValue,
                    rechargeOrigin
                  )
                ) {
                  await requests({
                    rechargeValue: '4000',
                    creditValue: '8000'
                  })
                } else if (
                  isInterRecharge50WithDiscount(
                    stringRechargeValue,
                    rechargeOrigin
                  )
                ) {
                  await requests({
                    rechargeValue: '5000',
                    creditValue: '10000'
                  })
                } else if (
                  isInterRecharge75WithDiscount(
                    stringRechargeValue,
                    rechargeOrigin
                  )
                ) {
                  await requests({
                    rechargeValue: '7500',
                    creditValue: '15000'
                  })
                } else {
                  // Recarga Nuage ********************************************
                  const requestRecarga: IRecargaRequest = {
                    msisdn: '55' + body.msisdn,
                    valor: body.valor.replace(',', ''),
                    dtExecucao: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
                    origem: 'ServCel',
                    nsu: responseTopUp.transactionID
                  }

                  const responseNuage = await NuageModel.procRecargaNuage(
                    requestRecarga
                  )

                  saveControllerLogs(
                    'POS RECARGA NUAGE ',
                    { body, response: responseNuage },
                    'servcelRecarga-controller'
                  )
                }
              } else {
                response.codResposta = '10'
              }
            } else {
              if (servCelResponse.code === '01') {
                response.codResposta = servCelResponse.code
              } else {
                const responseApi: IServCelResponse = await ServCelModel.procGetCodResposta(
                  body.msisdn,
                  'Recarga'
                )

                saveControllerLogs(
                  'POSPROCCODRESPOSTA',
                  { body, response: responseApi },
                  'servcelRecarga-controller'
                )

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

        const responsePro210 = await ServCelModel.procInsServCel(
          'Recarga',
          210,
          response.codResposta,
          checkPlintron,
          body
        )

        saveControllerLogs(
          'POS PROC 210      ',
          { body, response: responsePro210 },
          'servcelRecarga-controller'
        )
        saveControllerLogs(
          'FIM               ',
          body,
          'servcelRecarga-controller'
        )

        return res.format({
          'application/xml': () => {
            res.status(statusCode).send(buildXml(response.codResposta))
          }
        })
      })
      .catch((err: any) => {
        saveControllerLogs(
          'ERROR            ',
          { body: req.body, error: err.toString() },
          'servcelRecarga-controller'
        )

        statusCode = 400
        console.log(err)

        return res.format({
          'application/xml': () => {
            res.status(statusCode).send(buildXml(response.codResposta))
          }
        })
      })
  } catch (err) {
    saveControllerLogs(
      'ERROR            ',
      { body: req.body, error: err.toString() },
      'servcelRecarga-controller'
    )

    statusCode = 400
    console.log(err)

    return res.format({
      'application/xml': () => {
        res.status(statusCode).send(buildXml(response.codResposta))
      }
    })
  }
}
