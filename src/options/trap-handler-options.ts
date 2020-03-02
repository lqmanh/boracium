export interface TrapHandlerOptionsInterface {
  host?: string
  port?: number
}

export class TrapHandlerOptions implements TrapHandlerOptionsInterface {
  public readonly host = 'localhost'
  public readonly port = 3000

  constructor(options: TrapHandlerOptionsInterface) {
    Object.assign(this, options)
  }
}
