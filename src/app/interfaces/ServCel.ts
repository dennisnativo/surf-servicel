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
