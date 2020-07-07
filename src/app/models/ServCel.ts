import { QueryTypes } from 'sequelize'
import sequelize from '../../database'
import { IServCelRequest } from '../interfaces/ServCel'

class ServCel {
  public static async procInsServCel (metodo: string, phase: number, codResposta: string, request: IServCelRequest): Promise<any> {
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
        ${(codResposta !== '') ? `, @codResposta=N'${codResposta}'` : ''}`,
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

  public static async procGetCodResposta (msisdn: string): Promise<any> {
    const response = await sequelize.query(
      `exec HUB360.[recharge].[USP_GET_CODRESPOSTA] 
        @msisdn=N'${msisdn}'`,
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
}

export default ServCel
