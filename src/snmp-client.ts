import execa from 'execa'
import { MibParser } from './mib-parser'
import {
  SnmpClientGetWithOptions,
  SnmpClientGetWithOptionsInterface,
  SnmpClientOptions,
  SnmpClientOptionsInterface,
} from './options'
import { RawVarbindInterface, SnmpGetBinary, VarbindInterface } from './types'

export class SnmpClient {
  private readonly mibParser = new MibParser()
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

    const rawVarbinds = this.parseResponse(stdout)
    if (!autoParse) {
      return rawVarbinds.map((rawVarbind) => {
        const { oid, type, value } = rawVarbind
        return {
          numericOID: '',
          textualOID: oid, // we know OID got from this.parseResponse() is textual OID
          fullOID: '',
          type,
          value,
        }
      })
    } else {
      return Promise.all(
        rawVarbinds.map((rawVarbind) => this.mibParser.parseRawVarbind(rawVarbind))
      )
    }
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

  private parseResponse(res: string): RawVarbindInterface[] {
    const regex = /.+::.+ = ([A-Za-z0-9]+: )?.+/
    const result: RawVarbindInterface[] = []
    let buffer = ''
    for (const line of res.split('\n')) {
      if (regex.test(line)) {
        if (buffer) result.push(this.parseVarbindBuffer(buffer))
        buffer = line
      } else {
        buffer = `${buffer}\n${line}`
      }
    }
    if (buffer) result.push(this.parseVarbindBuffer(buffer))
    return result
  }

  private parseVarbindBuffer(buffer: string): RawVarbindInterface {
    const regex = /(.+::.+) = (([A-Za-z0-9]+): )?([^]+)/
    const match = buffer.match(regex)
    return {
      oid: match[1],
      type: match[3] || '',
      value: match[4],
    }
  }
}
