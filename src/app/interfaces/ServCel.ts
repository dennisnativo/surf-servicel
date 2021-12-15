export interface IServCelResponse {
  codResposta: string
}

export interface IServCelRequest {
  msisdn: string
  valor: string
  origem: string
  dataOrigem: string
  dataServCel: string
  nsuOrigem: string
  nsuServCel: string
  produto: string
  chave: string
  operadora: string
}

export interface IServCelInsResponse {
  code: string
  idServCel: string
}

export interface ITopUpRequest {
  productID: string
  MSISDN: string
  amount: string
  transactionID: string
  terminalID: string
  currency: string
  cardID: string
  retailerID: string
  twoPhaseCommit: string
}

export interface ITopUpResponse {
  code: string
  msg: string
  transactionID: string
}

export interface IGetAuthResponse {
  id: string
  network: string
  authentication: string
  plintronProductId: string
  ordem: number
}

export interface IRecargaRequest {
  msisdn: string
  valor: string
  dtExecucao: string
  origem: string
  nsu: string
  recorrencia: string
}

export interface IUSPRecharge {
  network: string
  phone: string
  rechargePhone: string
  rechargeNetworkId: string | null
  transId: string | null
  paymentType: string
  paymentId: number
  value: string
  statusId: string
  codRet: string | null
  returnMsg: string
  sourceId: number
  program: boolean
  cpf: string | null
  isSocio: boolean
}
