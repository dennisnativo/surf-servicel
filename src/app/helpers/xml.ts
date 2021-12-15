import xml from 'xml2js'

export const buildXml = (value: string): string => {
  const builder = new xml.Builder({
    renderOpts: { pretty: false }
  })

  return builder.buildObject({
    methodResponse: {
      params: {
        member: {
          name: 'codResposta',
          value: value
        }
      }
    }
  })
}
