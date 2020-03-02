import { EventEmitter } from 'events'
import fastify from 'fastify'
import {
  TrapHandlerOptions,
  TrapHandlerOptionsInterface
} from './options/trap-handler-options'

export default class TrapHandler extends EventEmitter {
  private readonly options: TrapHandlerOptions
  private readonly server = fastify()

  constructor(options: TrapHandlerOptionsInterface = {}) {
    super()
    this.options = new TrapHandlerOptions(options)

    this.server.post('/', (req, res) => {
      this.emit('rawdata', req.body)
      res.status(204)
    })
  }

  async start(): Promise<void> {
    const { host, port } = this.options
    await this.server.listen({ host, port })
  }
}
