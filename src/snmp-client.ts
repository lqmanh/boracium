import execa from 'execa'
import { SnmpClientOptions, SnmpClientOptionsInterface } from './options'
import { VarbindInterface } from './varbind'

export default class SnmpClient {
  private readonly options: SnmpClientOptions

  constructor(options: SnmpClientOptionsInterface) {
    this.options = new SnmpClientOptions(options)
  }

  private static parseSnmpResponse(res: string): { textualOID: string, type: string | null, value: string } {
    const found = res.match(/(.+::.+) = (([A-Za-z0-9]+): )?(.+)/)

    if (!found) throw new Error('Invalid SNMP response')

    return {
      textualOID: found[1],
      type: found[3] || null,
      value: found[4]
    }
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

  private async getWith(binary: 'snmpget' | 'snmpgetnext' | 'snmpbulkget', oid: string): Promise<VarbindInterface[]> {
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
      const { textualOID, type, value } = SnmpClient.parseSnmpResponse(snmpRes)
      const [numericOID, fullOID] = await Promise.all([
        this.translate(textualOID, 'numericOID'),
        this.translate(textualOID, 'fullOID')
      ])
      return { numericOID, textualOID, fullOID, type, value }
    })

    return Promise.all(varbindPromises)
  }

  async translate(oid: string, to: 'numericOID' | 'fullOID'): Promise<string> {
    let opt: string
    if (to === 'numericOID') opt = '-On'
    else if (to === 'fullOID') opt = '-Of'

    const { stdout, stderr } = await execa('snmptranslate', [opt, oid])

    if (stderr) throw new Error(stderr)

    return stdout
  }
}
