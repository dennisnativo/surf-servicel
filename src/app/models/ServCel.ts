import { QueryTypes } from 'sequelize'
import request from 'request-promise'
import sequelize from '../../database'

import { IServCelRequest, ITopUpRequest } from '../interfaces/ServCel'

class ServCel {
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
        return response[0]
      })
      .catch((err: any) => {
        console.log(err)
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
        console.log(err)
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
        console.log(err)
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
        console.log(err)
        return null
      })

    return response
  }

  public static async procTopUp (auth: string, requestData: ITopUpRequest): Promise<any> {
    const response = request({
      uri: 'http://192.168.120.25/Hub360/topUp',
      headers: {
        Authorization: auth
      },
      formData: { ...requestData },
      method: 'POST'
    }).then((response: any) => {
      return JSON.parse(response)
    }).catch((err) => {
      // console.log(err)
      return err
    })

    return response
  }
}

export default ServCel
