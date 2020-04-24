import { TrapHandlerOptionsInterface } from '../types'

export class TrapHandlerOptions implements TrapHandlerOptionsInterface {
  public readonly serverless = true
  public readonly host = 'localhost'
  public readonly port = 3000

  constructor(options: TrapHandlerOptionsInterface) {
    Object.assign(this, options)
  }
}
