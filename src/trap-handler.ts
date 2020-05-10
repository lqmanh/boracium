import { EventEmitter } from 'events'
import fastify, { FastifyInstance } from 'fastify'
import { MibParser } from './mib-parser'
import { TrapHandlerOptions, TrapHandlerOptionsInterface } from './options'
import { ParsedTrapMessage, RawTrapMessage, VarbindInterface } from './types'

export class TrapHandler extends EventEmitter {
  private readonly mibParser = new MibParser()
  private readonly options: TrapHandlerOptions
  private readonly server?: FastifyInstance

  public constructor(options: TrapHandlerOptionsInterface = {}) {
    super()
    this.options = new TrapHandlerOptions(options)

    if (!this.options.serverless) {
      this.server = fastify()
      this.server.post('/', async (req, res) => {
        const message = req.body
        this.emit('rawdata', message)
        this.emit('data', await this.parse(message))
        res.status(204).send({})
      })
    }
  }

  public async start(): Promise<void> {
    if (this.options.serverless) throw new Error('Cannot "start" in serverless mode')
    const { host, port } = this.options
    await this.server.listen({ host, port })
  }

  public async parse(message: RawTrapMessage): Promise<ParsedTrapMessage> {
    const remoteHostname = message['remote_hostname']

    const transportAddress = message['transport_address']
    const protocol = transportAddress['protocol']
    const remoteAddress = transportAddress['remote_address']
    const localAddress = transportAddress['local_address']

    const varbinds = await Promise.all(
      message.varbinds.map(
        (varbind): Promise<VarbindInterface> => {
          const { oid, value } = varbind
          return this.mibParser.parseRawVarbind({ oid, type: '', value })
        }
      )
    )

    const timestamp = new Date(message['timestamp'])

    return {
      remoteHostname,
      transportAddress: { protocol, remoteAddress, localAddress },
      varbinds,
      timestamp,
    }
  }
}
