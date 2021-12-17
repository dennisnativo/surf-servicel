import axios from 'axios'
import { ElasticAPM } from '../infra/observability/apm'

type Request = {
  msisdn: string;
  network: string;
  authentication: string;
  value: string;
};

export class Bundles {
  private static agent = ElasticAPM.getInstance().getAPM()

  public static async bundlePortability ({
    msisdn,
    network,
    authentication,
    value
  }: Request) {
    const response = await axios.post('http://192.168.120.25/bundle-api/api/v1/portabilities', {
      msisdn,
      network,
      authentication,
      value
    }).then((response: any) => {
      this.agent.currentSpan.addLabels({ msisdn, network, authentication, value, response, endpoint: '/bundle-api/api/v1/portabilities' })
      // console.log(response)
      return response
    }).catch((err) => {
      this.agent.currentSpan.addLabels({ msisdn, network, authentication, value, endpoint: '/bundle-api/api/v1/portabilities' })
      this.agent.captureError(err)
      return err
    })

    return response
  }
}
