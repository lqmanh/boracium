import execa from 'execa'
import { SnmpClientOptions, SnmpClientOptionsInterface } from './options'
import { VarbindInterface } from './varbind'
import MibParser from './mib-parser'

type ParsedSnmpResponse = { textualOID: string; type: string | null; value: string }
type SnmpGetBinary = 'snmpget' | 'snmpgetnext' | 'snmpbulkget'

const parseSnmpResponse = (res: string): ParsedSnmpResponse => {
  const found = res.match(/(.+::.+) = (([A-Za-z0-9]+): )?(.+)/)

  if (!found) throw new Error('Invalid SNMP response')

  return {
    textualOID: found[1],
    type: found[3] || null,
    value: found[4]
  }
}

export default class SnmpClient {
  private readonly options: SnmpClientOptions
  private readonly mibParser: MibParser

  constructor(options: SnmpClientOptionsInterface = {}) {
    this.options = new SnmpClientOptions(options)
    this.mibParser = new MibParser()
  }

  public get(oid: string): Promise<VarbindInterface[]> {
    return this.getWith('snmpget', oid)
  }

  public getNext(oid: string): Promise<VarbindInterface[]> {
    return this.getWith('snmpgetnext', oid)
  }

  public getBulk(oid: string): Promise<VarbindInterface[]> {
    return this.getWith('snmpbulkget', oid)
  }

  private async getWith(binary: SnmpGetBinary, oid: string): Promise<VarbindInterface[]> {
    const { stdout, stderr } = await execa(binary, [
      '-v',
      this.options.version,
      '-c',
      this.options.community,
      `${this.options.host}:${this.options.port}`,
      oid
    ])

    if (stderr) throw new Error(stderr)

    const varbindPromises = stdout.split('\n').map(async (snmpRes) => {
      const { textualOID, type, value } = parseSnmpResponse(snmpRes)
      const [numericOID, fullOID] = await Promise.all([
        this.mibParser.translate(textualOID, 'numericOID'),
        this.mibParser.translate(textualOID, 'fullOID')
      ])
      return { numericOID, textualOID, fullOID, type, value }
    })

    return Promise.all(varbindPromises)
  }
}
