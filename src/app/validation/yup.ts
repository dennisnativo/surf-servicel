import * as Yup from 'yup'

export const rechargeYupSchema = Yup.object().shape({
  msisdn: Yup.string().required('MSISDN é obrigatório'),
  valor: Yup.string().required('Valor é obrigatório'),
  origem: Yup.string().required('Origem é obrigatório'),
  dataOrigem: Yup.string().required('Data de origem é obrigatório'),
  dataServCel: Yup.string().required('Data da transação é obrigatório'),
  nsuOrigem: Yup.string().required('NSU de origem é obrigatório'),
  nsuServCel: Yup.string().required('NSU da transação é obrigatório'),
  produto: Yup.string().required('Produto é obrigatório'),
  chave: Yup.string().required('Chave é obrigatório'),
  operadora: Yup.string().required('Operadora é obrigatório')
})

export const queryYupSchema = Yup.object().shape({
  msisdn: Yup.string().required('MSISDN é obrigatório'),
  valor: Yup.string().required('Valor é obrigatório'),
  origem: Yup.string().required('Origem é obrigatório'),
  produto: Yup.string().required('Produto é obrigatório'),
  operadora: Yup.string().required('Operadora é obrigatório')
})
