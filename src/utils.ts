import { ParsedSnmpResponse } from './types'

export const parseSnmpResponse = (res: string): ParsedSnmpResponse => {
  const found = res.match(/(.+::.+) = (([A-Za-z0-9]+): )?(.+)/)

  if (!found) throw new Error('Invalid SNMP response')

  return {
    textualOID: found[1],
    type: found[3] || null,
    value: found[4]
  }
}
