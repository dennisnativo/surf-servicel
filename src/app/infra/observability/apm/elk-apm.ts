import 'reflect-metadata'
import agent from 'elastic-apm-node'
import { ELK } from '../../../utils/constants'

export class ElasticAPM {
  private apm: agent.Agent;

  private static instance: ElasticAPM;

  constructor () {
    this.apm = this.start()
  }

  public static getInstance (): ElasticAPM {
    if (!ElasticAPM.instance) {
      ElasticAPM.instance = new ElasticAPM()
    }

    return ElasticAPM.instance
  }

  private start () {
    return agent.start({
      serviceName: 'api-servcel',
      secretToken: ELK.SECRET_TOKEN,
      serverUrl: ELK.SERVER_URL,
      environment: ELK.ENVIRONMENT,
      active: true,
      captureBody: 'all',
      captureHeaders: true,
      captureErrorLogStackTraces: 'always',
      captureExceptions: true,
      asyncHooks: true,
      logLevel: 'off',
      logUncaughtExceptions: true,
      instrument: true,
      instrumentIncomingHTTPRequests: true,
      captureSpanStackTraces: true
    })
  }

  public getAPM () {
    return this.apm as typeof agent
  }
}
