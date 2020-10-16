import request from 'request-promise'
import sequelize from '../../database'
import { IRecargaRequest } from '../interfaces/ServCel'
import { saveControllerLogs } from '../helpers/logs'

class Nuage {
  public static async saveContaOnDb ({
    msisdn = '', accountId = null, iccid = null, transactionId = null, phase = '', requestBody = '', requestHeader = '', responseBody = ''
  }): Promise<any> {
    return sequelize.query(
          `exec nuage.INS_SPEC_CONTA
          @msisdn = ?,
          @transaction_id = ?,
          @phase = ?,
          @request_body = ?,
          @request_header = ?,
          @response_body = ?,
          @created_at = ?,
          @updated_at = ?,
          @account_id = ?,
          @iccid = ?
        `,
          {
            replacements: [
              msisdn, transactionId, phase, requestBody, requestHeader, responseBody, new Date(), new Date(), accountId, iccid
            ]
          }
    )
  }

  public static async procNuage (msisdn: string): Promise<any> {
    const body = { msisdn: '55' + msisdn }
    saveControllerLogs('INICIO            ', body, 'conta-controller')

    const proc200Response = await this.saveContaOnDb({
      msisdn: '55' + msisdn,
      accountId: null,
      iccid: null,
      phase: '200',
      requestBody: JSON.stringify(body),
      requestHeader: JSON.stringify({})
    })

    saveControllerLogs('PROC 200 RESPONSE ', { body, proc200Response }, 'conta-controller')

    const response = await request({
      uri: `https://plataforma.surfgroup.com.br/api/spec/v1/conta/55${msisdn}`,
      method: 'GET',
      json: true
    }).then((response: any) => {
      return response
    }).catch((err) => {
      console.log(err)
      return false
    })

    let phase = '210'
    let responseBody: string = ''
    if (!response || response.erro) {
      phase = '99'
      responseBody = ''
    } else {
      responseBody = JSON.stringify(response)
    }

    saveControllerLogs('POS-REQUEST-NUAGE ', { body: body, response }, 'conta-controller')

    const proc210Response = await this.saveContaOnDb({
      msisdn,
      accountId: null,
      iccid: null,
      transactionId: response.transacao ? response.transacao : null,
      phase,
      requestBody: JSON.stringify(body),
      requestHeader: JSON.stringify({}),
      responseBody
    })

    saveControllerLogs(`PROC ${phase} RESPONSE `, { body: body, proc210Response }, 'conta-controller')

    saveControllerLogs('FINAL             ', body, 'conta-controller')

    return response
  }

  public static async procRecargaNuage (entrada: IRecargaRequest): Promise<any> {
    const response = request({
      uri: 'https://www.pagtel.com.br/Nuage-teste/api/v1/recarga',
      body: {
        msisdn: entrada.msisdn,
        valor: entrada.valor,
        dtExecucao: entrada.dtExecucao,
        origem: entrada.origem,
        nsu: entrada.nsu
      },
      method: 'POST',
      json: true
    }).then((response: any) => {
      return response
    }).catch((err) => {
      console.log(err)
      return false
    })

    return response
  }
}

export default Nuage
