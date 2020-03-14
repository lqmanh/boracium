import MibParser from './mib-parser'
import { ParsedSnmpResponse, VarbindInterface } from './types'

export const parseSnmpResponse = (res: string): ParsedSnmpResponse => {
  const found = res.match(/(.+::.+) = (([A-Za-z0-9]+): )?(.+)/)

  if (!found) throw new Error('Invalid SNMP response')

  return {
    textualOID: found[1],
    type: found[3] || '',
    value: found[4]
  }
}

export const toVarbind = async (
  oid: string,
  value: string,
  type = ''
): Promise<VarbindInterface> => {
  const mibParser = new MibParser()
  const [numericOID, textualOID, fullOID] = await Promise.all([
    mibParser.translate(oid, 'numericOID'),
    mibParser.translate(oid, 'textualOID'),
    mibParser.translate(oid, 'fullOID')
  ])
  return { numericOID, textualOID, fullOID, type, value }
}
