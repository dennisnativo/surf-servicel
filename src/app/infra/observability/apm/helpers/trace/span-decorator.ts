import { ElasticAPM } from '../../elk-apm'
import { traceLabels, SpanOptions } from './trace-protocols'
import { searchLabels, getType, labelParamsToString, getName } from '.'

type TraceParams = {
  options: SpanOptions;
  params?: traceLabels;
  result?: traceLabels;
};

export function apmSpan ({ options, params, result }: TraceParams) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const apm = ElasticAPM.getInstance().getAPM()

    const originalMethod = descriptor.value

    descriptor.value = async function (...args) {
      const spanName = getName(args, options)

      const span = apm?.currentTransaction?.startSpan(spanName)

      const methodResult = await originalMethod.apply(this, args)

      if (!span) return methodResult

      if (options?.subtype) {
        const type = getType(options.subtype)
        if (type) span.type = type

        span.subtype = options.subtype
      }

      if (params) {
        const labels = searchLabels(params, args)
        const labelsToString = labelParamsToString(labels)
        span.addLabels(labelsToString, true)
      }

      if (result) {
        const labels = searchLabels(result, methodResult)
        const labelsToString = labelParamsToString(labels)
        span.addLabels(labelsToString, true)
      }

      span.end()

      return methodResult
    }

    return descriptor
  }
}
