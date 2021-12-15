import { getName, labelParamsToString, searchLabels } from '.'
import { ElasticAPM } from '../../elk-apm'
import { traceLabels, TransactionOptions } from './trace-protocols'

type TransactionParams = {
  options: TransactionOptions;
  params?: traceLabels;
  result?: traceLabels;
};

export function apmTransaction ({ options, params, result }: TransactionParams) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const apm = ElasticAPM.getInstance().getAPM()

    const originalMethod = descriptor.value

    descriptor.value = async function (...args) {
      const transactionName = getName(args, options)

      const transaction = apm.startTransaction(transactionName)

      const methodResult = await originalMethod.apply(this, args)

      if (options?.type) transaction.type = options?.type

      if (params) {
        const labels = searchLabels(params, args)
        const labelsToString = labelParamsToString(labels)
        transaction.addLabels(labelsToString, true)
      }

      if (result) {
        const labels = searchLabels(result, methodResult)
        const labelsToString = labelParamsToString(labels)
        transaction.addLabels(labelsToString, true)
      }

      transaction.end()

      return methodResult
    }

    return descriptor
  }
}
