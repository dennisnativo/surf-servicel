import { QueryTypes } from 'sequelize'
import sequelize from '../../database'

import { IServCelRequest, ITopUpRequest, IUSPRecharge } from '../interfaces/ServCel'
import { ElasticAPM } from '../infra/observability/apm'
import axios from 'axios'

class ServCel {
  private static agent = ElasticAPM.getInstance().getAPM()

  public static async procInsServCel (metodo: string, phase: number, codResposta: string, plintron: boolean | null, request: IServCelRequest): Promise<any> {
    const response = await sequelize.query(
      `exec HUB360.[recharge].[INS_SERVCEL] 
        @metodo=N'${metodo}',
        @phase=${phase},
        @msisdn=N'${request.msisdn}',
        @valor=N'${request.valor}',
        @origem=${request.origem},
        ${(request.dataOrigem !== '') ? `@dataOrigem=N'${request.dataOrigem}',` : ''}
        ${(request.dataServCel !== '') ? `@dataServCel=N'${request.dataServCel}',` : ''}
        ${(request.nsuOrigem !== '') ? `@nsuOrigem=N'${request.nsuOrigem}',` : ''}
        ${(request.nsuServCel !== '') ? `@nsuServCel=N'${request.nsuServCel}',` : ''}
        @produto=${request.produto},
        ${(request.chave !== '') ? `@chave=N'${request.chave}',` : ''}
        @operadora=${request.operadora}
        ${(codResposta !== '') ? `, @codResposta=N'${codResposta}'` : ''}
        ${(plintron !== null) ? `, @plintron=${plintron}` : ''}`,
      { type: QueryTypes.SELECT }
    )
      .then((response: any) => {
        // console.log(response)
        return response[0]
      })
      .catch((err: any) => {
        // console.log(err)
        return null
      })

    return response
  }

  public static async procGetCodResposta (msisdn: string, metodo: string): Promise<any> {
    const response = await sequelize.query(
      `exec HUB360.[recharge].[USP_GET_CODRESPOSTA] 
        @msisdn=N'${msisdn}', @metodo=N'${metodo}'`,
      { type: QueryTypes.SELECT }
    )
      .then((response: any) => {
        return response[0]
      })
      .catch((err: any) => {
        // console.log(err)
        return null
      })

    return response
  }

  public static async procCheckPlintron (): Promise<boolean> {
    const response = await sequelize.query(
      'SELECT TOP (1) [plintron] FROM [Hub360].[recharge].[tb_servCel_checkPlintron]',
      { type: QueryTypes.SELECT }
    )
      .then((response: any) => {
        return response[0]
      })
      .catch((err: any) => {
        // console.log(err)
        return null
      })

    return response.plintron
  }

  public static async procGetAuth (msisdn: string, operadora: string): Promise<any> {
    const response = await sequelize.query(
      `Exec [Hub360].[recharge].[USP_SERVCEL_GETAUTH]
      @msisdn=N'${msisdn}',
      @operadora=N'${operadora}'`,
      { type: QueryTypes.SELECT }
    )
      .then((response: any) => {
        return response[0]
      })
      .catch((err: any) => {
        // console.log(err)
        return null
      })

    return response
  }

  public static async procInsPlintron (auth: string, requestData: ITopUpRequest): Promise<any> {
    const response = await sequelize.query(
      `Exec [Hub360].[recharge].[INS_SERVCEL_PLINTRON]
        @authentication=N'${auth}',
        @produtoID=N'${requestData.productID}',
        @transactionID=N'${requestData.transactionID}',
        @msisdn=N'${requestData.MSISDN}',
        @amount=N'${requestData.amount}',
        @terminalID=N'${requestData.terminalID}',
        @currency=N'${requestData.currency}',
        @cardID=N'${requestData.cardID}',
        @retailerID=N'${requestData.retailerID}',
        @phase=${requestData.twoPhaseCommit}`,
      { type: QueryTypes.SELECT }
    )
      .then((response: any) => {
        return response[0]
      })
      .catch((err: any) => {
        // console.log(err)
        return null
      })

    return response
  }

  public static async procTopUp (auth: string, requestData: ITopUpRequest): Promise<any> {
    const formData = new FormData()

    for (const key in Object.keys(requestData)) {
      formData.append(key, requestData[key])
    }

    const response = await axios({
      method: 'POST',
      url: 'http://192.168.120.25/Hub360/topUp',
      data: formData,
      headers: {
        Authorization: auth
      }
    }).then((response: any) => {
      this.agent.currentSpan.addLabels({ ...requestData, auth, response, endpoint: '/Hub360/topUp' })
      return JSON.parse(response)
    }).catch((err) => {
      this.agent.currentSpan.addLabels({ ...requestData, auth, endpoint: '/Hub360/topUp' })
      this.agent.captureError(err)
      // console.log(err)
      return err
    })

    return response
  }

  public static procInsRecharge = async (request: IUSPRecharge) => {
    // console.log({ request })
    const response = await sequelize.query(
      `EXEC [Hub360].[recharge].[USP_RECHARGE] 
      @network = N'${request.network}',
      @phone = N'${request.phone}',
      @rechargePhone = N'${request.rechargePhone}',
      @rechargeNetworkId = N'${request.rechargeNetworkId}',
      @transId = N'${request.transId}',
      @paymentType = N'${request.paymentType}',
      @paymentId = ${request.paymentId},
      @value = N'${request.value}',
      @statusId = N'${request.statusId}',
      @codRet = N'${request.codRet}',
      @returnMsg = N'${request.returnMsg}',
      @sourceId = ${request.sourceId},
      @program = ${request.program},
      @cpf = N'${request.cpf}',
      @isSocio = ${request.isSocio}`,
      { type: QueryTypes.SELECT }
    )
      .then((response: any) => {
        return response[0]
      })
      .catch((err: any) => {
        // console.log(err)
        return null
      })

    return response
  }
}

export default ServCel
