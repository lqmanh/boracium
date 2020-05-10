import { MibParser } from './mib-parser'
import { VarbindInterface } from './types'

const mibParser = new MibParser()

export const toVarbind = async (
  oid: string,
  value: string,
  type = ''
): Promise<VarbindInterface> => {
  const [numericOID, textualOID, fullOID] = await Promise.all([
    mibParser.translate(oid, 'numericOID'),
    mibParser.translate(oid, 'textualOID'),
    mibParser.translate(oid, 'fullOID'),
  ])
  return { numericOID, textualOID, fullOID, type, value }
}
