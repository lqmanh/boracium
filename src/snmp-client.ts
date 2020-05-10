import execa from 'execa'
import {
  SnmpClientGetWithOptions,
  SnmpClientGetWithOptionsInterface,
  SnmpClientOptions,
  SnmpClientOptionsInterface,
} from './options'
import { ParsedSnmpResponse, SnmpGetBinary, VarbindInterface } from './types'
import { toVarbind } from './utils'

export class SnmpClient {
  private readonly options: SnmpClientOptions

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

  public walk(oid = ''): Promise<VarbindInterface[]> {
    return this.getWith('snmpwalk', oid, { autoParse: false })
  }

  private async getWith(
    binary: SnmpGetBinary,
    oid: string,
    options: SnmpClientGetWithOptionsInterface = {}
  ): Promise<VarbindInterface[]> {
    const { autoParse } = new SnmpClientGetWithOptions(options)
    const { stdout, stderr } = await execa(binary, this.getBinaryArgs(oid))

    if (stderr) throw new Error(stderr)

    const varbindPromises = stdout.split('\n').map(
      (snmpRes): Promise<VarbindInterface> => {
        const { textualOID, type, value } = this.parseSnmpResponse(snmpRes)

        if (!autoParse) {
          return Promise.resolve({
            numericOID: '',
            textualOID,
            fullOID: '',
            type,
            value,
          })
        }
        return toVarbind(textualOID, value, type)
      }
    )

    return Promise.all(varbindPromises)
  }

  private getBinaryArgs(oid: string): string[] {
    const { host, port, version, community, user } = this.options
    const agent = `${host}:${port}`
    let args: string[]

    if (['1', '2c'].includes(this.options.version)) {
      args = ['-v', version, '-c', community, agent]
    } else {
      args = [
        '-v',
        '3',
        '-u',
        user.username,
        '-A',
        user.authPassword,
        '-a',
        user.authProtocol,
        '-X',
        user.privPassword,
        '-x',
        user.privProtocol,
        '-l',
        user.securityLevel,
        agent,
      ]
    }
    if (oid) args.push(oid)

    return args
  }

  private parseSnmpResponse(res: string): ParsedSnmpResponse {
    const found = res.match(/(.+::.+) = (([A-Za-z0-9]+): )?(.+)/)

    if (!found) throw new Error('Invalid SNMP response')

    return {
      textualOID: found[1],
      type: found[3] || '',
      value: found[4],
    }
  }
}
