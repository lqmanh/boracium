import execa from 'execa'
import {
  SnmpClientOptions,
  SnmpClientOptionsInterface
} from './options/snmp-client-options'
import { VarbindInterface, SnmpGetBinary } from './types'
import MibParser from './mib-parser'
import { parseSnmpResponse } from './utils'

export default class SnmpClient {
  private readonly options: SnmpClientOptions
  private readonly mibParser = new MibParser()

  constructor(options: SnmpClientOptionsInterface = {}) {
    this.options = new SnmpClientOptions(options)
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
    const { stdout, stderr } = await execa(binary, this.getBinaryArgs(oid))

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

  private getBinaryArgs(oid: string): string[] {
    const agent = `${this.options.host}:${this.options.port}`

    // yes, linter is too dumb to use this.options.version !== '3'
    if (['1', '2c'].includes(this.options.version))
      return ['-v', this.options.version, '-c', this.options.community, agent, oid]

    const {
      username,
      authPassword,
      authProtocol,
      privPassword,
      privProtocol,
      securityLevel
    } = this.options.user

    return [
      '-v',
      '3',
      '-u',
      username,
      '-A',
      authPassword,
      '-a',
      authProtocol,
      '-X',
      privPassword,
      '-x',
      privProtocol,
      '-l',
      securityLevel,
      agent,
      oid
    ]
  }
}
