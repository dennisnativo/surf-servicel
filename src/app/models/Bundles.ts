import request from 'request-promise'

type Request = {
  msisdn: string;
  network: string;
  authentication: string;
  value: string;
};

export class Bundles {
  public static async bundlePortability ({
    msisdn,
    network,
    authentication,
    value
  }: Request) {
    const response = request({
      uri: 'http://192.168.120.25/bundle-api/api/v1/portabilities',
      body: {
        msisdn,
        network,
        authentication,
        value
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
}
