import request from 'request-promise'
import dateFormat from 'dateformat'
import { v4 } from 'uuid'
import sequelize from '../../database'
import { IRecargaRequest } from '../interfaces/ServCel'
import { saveControllerLogs } from '../helpers/logs'

interface ICheckIfNumberCanBeRefilled{
  msisdn: string
  valor: string,
}
class Nuage {
  public static async saveContaOnDb ({
    msisdn = '',
    accountId = null,
    iccid = null,
    transactionId = null,
    phase = '',
    requestBody = '',
    requestHeader = '',
    responseBody = ''
  }) {
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

  public static async saveRecargaOnDb ({
    msisdn = '', valor = '', dtExecucao = '', origem = '', nsu = '', transactionId = null, phase = '', requestBody = '', requestHeader = '', responseBody = ''
  }): Promise<any> {
    return sequelize.query(
          `exec nuage.INS_SPEC_RECARGA
          @msisdn = ?,
          @valor = ?,
          @dt_execucao = ?,
          @origem = ?,
          @nsu = ?,
          @transaction_id = ?,
          @phase = ?,
          @request_body = ?,
          @request_header = ?,
          @response_body = ?,
          @created_at = ?,
          @updated_at = ?
        `,
          {
            replacements: [
              msisdn, valor, dtExecucao, origem, nsu, transactionId, phase, requestBody, requestHeader, responseBody, new Date(), new Date()
            ]
          }
    )
  }

  public static async saveCreditoOnDb ({
    msisdn = '', valor = '', dtExecucao = '', origem = '', nsu = '', transactionId = null, phase = '', requestBody = '', requestHeader = '', responseBody = ''
  }): Promise<any> {
    return sequelize.query(
          `exec nuage.INS_SPEC_CREDITO
          @msisdn = ?,
          @valor = ?,
          @dt_execucao = ?,
          @origem = ?,
          @nsu = ?,
          @transaction_id = ?,
          @phase = ?,
          @request_body = ?,
          @request_header = ?,
          @response_body = ?,
          @created_at = ?,
          @updated_at = ?
        `,
          {
            replacements: [
              msisdn, valor, dtExecucao, origem, nsu, transactionId, phase, requestBody, requestHeader, responseBody, new Date(), new Date()
            ]
          }
    )
  }

  public static async geraToken (body = {}, controller: string = ''): Promise<string> {
    let token = ''
    const rastreio = v4()

    saveControllerLogs('PRE REQUEST TOKEN ', { body, rastreio }, controller)

    const response = await request({
      uri: 'https://plataforma.surfgroup.com.br/api/spec/v1/auth',
      body: {
        email: 'pagtel@api.com.br',
        senha: '4GqQ8F2rF0bV'
      },
      method: 'POST',
      json: true
    }).then((response: any) => {
      return response
    }).catch((err) => {
      saveControllerLogs('ERROR REQUEST NUAGE ', { error: err }, controller)
      console.log(err)
      return false
    })

    token = response?.sucesso === 0 ? response.token : ''

    saveControllerLogs('PEGOU TOKEN       ', { body, token }, controller)

    return token
  }

  public static async checkMvno (msisdn: string) {
    const body = {
      msisdn: '55' + msisdn
    }

    saveControllerLogs('INICIO            ', body, 'conta-controller')

    const token = await this.geraToken(body, 'conta-controller')

    saveControllerLogs('PRE REQUEST CONTA ', { body }, 'conta-controller')

    const response = await request({
      uri: `https://plataforma.surfgroup.com.br/api/spec/v1/conta/55${msisdn}`,
      headers: {
        token
      },
      body,
      method: 'GET',
      json: true
    }).then((response: any) => {
      console.log(response)
      return response
    }).catch((err) => {
      saveControllerLogs('ERROR REQUEST NUAGE ', { error: err }, 'conta-controller')
      console.log(err)
      return false
    })

    saveControllerLogs('POS-REQUEST-CONTA ', { body: body, response }, 'conta-controller')

    return (response && response.sucesso === 0) ? response.resultado.mvno : null
  }

  public static async checkIfNumberCanBeRefilled ({ msisdn, valor }:ICheckIfNumberCanBeRefilled): Promise<any> {
    const body = {
      msisdn: '55' + msisdn,
      valor: valor.trim().replace(',', ''),
      dtExecucao: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
      origem: 'ServCel',
      nsu: v4(),
      simular: 1
    }

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

    const token = await this.geraToken(body, 'conta-controller')

    let phase = '210'
    let responseBody: string = ''
    let retorno = true
    let transactionId = null

    if (token !== '') {
      const rastreio = v4()

      saveControllerLogs('PRE REQUEST NUAGE ', { body, rastreio }, 'conta-controller')

      const response = await request({
        uri: 'https://plataforma.surfgroup.com.br/api/spec-recarga/v1/recarga',
        headers: {
          token
        },
        body,
        method: 'POST',
        json: true
      }).then((response: any) => {
        console.log(response)
        return response
      }).catch((err) => {
        saveControllerLogs('ERROR REQUEST NUAGE ', { error: err }, 'conta-controller')
        console.log(err)
        return false
      })

      if (!response || response.erro) {
        phase = '99'
        responseBody = ''
        retorno = false
      } else {
        responseBody = JSON.stringify(response)
        transactionId = response.transacao ? response.transacao : null
      }

      saveControllerLogs('POS-REQUEST-NUAGE ', { body: body, response }, 'conta-controller')
    } else {
      phase = '99'
      responseBody = ''
      retorno = false
    }

    const proc210Response = await this.saveContaOnDb({
      msisdn,
      accountId: null,
      iccid: null,
      transactionId,
      phase,
      requestBody: JSON.stringify(body),
      requestHeader: JSON.stringify({}),
      responseBody
    })

    saveControllerLogs(`PROC ${phase} RESPONSE `, { body: body, proc210Response }, 'conta-controller')

    saveControllerLogs('FINAL             ', body, 'conta-controller')

    return retorno
  }

  public static async procRecargaNuage (entrada: IRecargaRequest): Promise<any> {
    const body = entrada
    saveControllerLogs('INICIO            ', body, 'recarga-controller')

    const dataExecucao = new Date(entrada.dtExecucao)
    dataExecucao.setHours(dataExecucao.getHours())

    const proc200Response = await this.saveRecargaOnDb({
      msisdn: entrada.msisdn,
      valor: entrada.valor,
      dtExecucao: dateFormat(dataExecucao, 'yyyy-mm-dd HH:MM:ss'),
      origem: entrada.origem,
      nsu: entrada.nsu,
      phase: '200',
      requestBody: JSON.stringify(body),
      requestHeader: JSON.stringify({})
    })

    saveControllerLogs('PROC 200 RESPONSE ', { body, proc200Response }, 'recarga-controller')

    const token = await this.geraToken(body, 'recarga-controller')

    let phase = '210'
    let responseBody: string = ''
    let retorno = ''
    let transactionId = null

    if (token !== '') {
      const rastreio = v4()

      const recargaRequestBody = {
        msisdn: entrada.msisdn,
        valor: entrada.valor,
        dtExecucao: dataExecucao.toISOString(),
        origem: entrada.origem,
        nsu: entrada.nsu,
        recorrencia: entrada.recorrencia
      }

      saveControllerLogs('PRE REQUEST NUAGE ', { body, rastreio }, 'recarga-controller')

      const response = await request({
        uri: 'https://plataforma.surfgroup.com.br/api/spec-recarga/v1/recarga',
        headers: {
          token,
          rastreio
        },
        body: recargaRequestBody,
        method: 'POST',
        json: true
      }).then((response: any) => {
        console.log(response)
        return response
      }).catch((err) => {
        saveControllerLogs('ERROR REQUEST NUAGE ', { error: err }, 'recarga-controller')
        console.log(err)
        return false
      })

      if (!response || response.erro) {
        phase = '99'
        responseBody = ''
        retorno = response || 'ERROR'
      } else {
        responseBody = JSON.stringify(response)
        transactionId = response.transacao ? response.transacao : null
        retorno = response
      }

      saveControllerLogs('POS-REQUEST-NUAGE ', { body: body, response }, 'recarga-controller')
    } else {
      phase = '99'
      responseBody = ''
      retorno = 'ERRO TOKEN'
    }

    const proc210Response = await this.saveRecargaOnDb({
      msisdn: entrada.msisdn,
      valor: entrada.valor,
      dtExecucao: dateFormat(dataExecucao, 'yyyy-mm-dd HH:MM:ss'),
      origem: entrada.origem,
      nsu: entrada.nsu,
      transactionId,
      phase,
      requestBody: JSON.stringify(body),
      requestHeader: JSON.stringify({}),
      responseBody
    })

    saveControllerLogs(`PROC ${phase} RESPONSE `, { body: body, proc210Response }, 'recarga-controller')

    saveControllerLogs('FINAL             ', body, 'recarga-controller')

    return retorno
  }

  public static async addCredit (params: IRecargaRequest) {
    saveControllerLogs('INICIO            ', params, 'recarga-controller')

    const dataExecucao = new Date(params.dtExecucao)
    dataExecucao.setHours(dataExecucao.getHours() - 3)

    const proc200Response = await this.saveCreditoOnDb({
      msisdn: params.msisdn,
      valor: params.valor,
      dtExecucao: dateFormat(dataExecucao, 'yyyy-mm-dd HH:MM:ss'),
      origem: params.origem,
      nsu: params.nsu,
      phase: '200',
      requestBody: JSON.stringify(params),
      requestHeader: JSON.stringify({})
    })

    saveControllerLogs('PROC 200 RESPONSE ', { body: params, proc200Response }, 'recarga-controller')

    const token = await this.geraToken(params, 'recarga-controller')

    let phase = '210'
    let responseBody: string = ''
    let retorno = ''
    let transactionId = null

    if (token !== '') {
      const rastreio = v4()

      const recargaRequestBody = {
        msisdn: params.msisdn,
        valor: params.valor,
        acao: 'c',
        noProduto: 'PagTel'
      }

      saveControllerLogs('PRE REQUEST NUAGE ', { body: params, rastreio }, 'recarga-controller')

      const response = await request({
        uri: 'https://plataforma.surfgroup.com.br/api/spec-recarga/v1/recarga/credito',
        headers: {
          token,
          rastreio
        },
        body: recargaRequestBody,
        method: 'POST',
        json: true
      }).then((response: any) => {
        console.log(response)
        return response
      }).catch((err) => {
        saveControllerLogs('ERROR REQUEST NUAGE ', { error: err }, 'recarga-controller')
        console.log(err)
        return false
      })

      if (!response || response.erro) {
        phase = '99'
        responseBody = ''
        retorno = response || 'ERROR'
      } else {
        responseBody = JSON.stringify(response)
        transactionId = response.transacao ? response.transacao : null
        retorno = response
      }

      saveControllerLogs('POS-REQUEST-NUAGE ', { body: params, response }, 'recarga-controller')
    } else {
      phase = '99'
      responseBody = ''
      retorno = 'ERRO TOKEN'
    }

    const proc210Response = await this.saveCreditoOnDb({
      msisdn: params.msisdn,
      valor: params.valor,
      dtExecucao: dateFormat(dataExecucao, 'yyyy-mm-dd HH:MM:ss'),
      origem: params.origem,
      nsu: params.nsu,
      transactionId,
      phase,
      requestBody: JSON.stringify(params),
      requestHeader: JSON.stringify({}),
      responseBody
    })

    saveControllerLogs(`PROC ${phase} RESPONSE `, { body: params, proc210Response }, 'recarga-controller')

    saveControllerLogs('FINAL             ', params, 'recarga-controller')

    return retorno
  }
}

export default Nuage
