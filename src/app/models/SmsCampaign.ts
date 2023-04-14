import request from 'request-promise'
import sequelize from '../../database'
import { QueryTypes } from 'sequelize'

type CreateCampaignRegisterProps = {
  msisdn: string;
  network: string;
  valorPlano: string;
  topUp: string;
  valuePaid: string;
  fluxo?: 'SWE' | 'STR';
};

type AllowIncludeSmsCampaignParams = {
  msisdn: string;
  network: string;
  sourceId: number;
  value: string;
  fluxo?: 'SWE';
};

export class SmsCampaign {
  public static async createInSmsCampaign ({
    msisdn,
    network,
    topUp,
    valuePaid,
    valorPlano
  }: CreateCampaignRegisterProps) {
    const response = request({
      uri: `${process.env.API_SMS_CAMPAIGN}reminder`,
      body: {
        msisdn,
        network,
        topUp,
        valuePaid,
        valorPlano,
        fluxo: 'SWE'
      },
      json: true,
      method: 'POST'
    })
      .then((response: any) => {
        console.log(response)
        return response
      })
      .catch((err) => {
        return err
      })

    return response
  }

  public static procAllowToIncludeInSmsCampaign = async (
    params: AllowIncludeSmsCampaignParams
  ) => {
    const response:{status:boolean} = await sequelize
      .query(
        `EXEC [Hub360].[reminder].[USP_CHECK_MSISDN] 
      @msisdn = '${params.msisdn}',
      @network = '${params.network}',
      @sourceId = ${params.sourceId},
      @value = '${params.value}',
      @fluxo = 'SWE'`,
        { type: QueryTypes.SELECT }
      )
      .then((response: any) => {
        return response[0]
      })
      .catch((err: any) => {
        console.log(err)
        return null
      })

    const { status } = response
    return status
  };
}
