import { EventEmitter } from 'events'
import fastify from 'fastify'
import {
  TrapHandlerOptions,
  TrapHandlerOptionsInterface
} from './options/trap-handler-options'
import { VarbindInterface } from './types'
import { toVarbind } from './utils'

export default class TrapHandler extends EventEmitter {
  private readonly options: TrapHandlerOptions
  private readonly server = fastify()

  constructor(options: TrapHandlerOptionsInterface = {}) {
    super()
    this.options = new TrapHandlerOptions(options)

    this.server.post('/', async (req, res) => {
      const message = req.body
      this.emit('rawdata', message)

      const remoteHostname = message['remote_hostname']
      const transportAddress = message['transport_address']
      const protocol = transportAddress['protocol']
      const remoteAddress = transportAddress['remote_address']
      const localAddress = transportAddress['local_address']
      const varbinds = await Promise.all(
        message.varbinds.map(
          (varbind): Promise<VarbindInterface> => {
            const { oid, value } = varbind
            return toVarbind(oid, value, '')
          }
        )
      )
      this.emit('data', {
        remoteHostname,
        transportAddress: { protocol, remoteAddress, localAddress },
        varbinds
      })

      res.status(204)
      return {}
    })
  }

  async start(): Promise<void> {
    const { host, port } = this.options
    await this.server.listen({ host, port })
  }
}
