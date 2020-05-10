export interface TrapHandlerOptionsInterface {
  serverless?: boolean
  host?: string
  port?: number
}

export class TrapHandlerOptions implements TrapHandlerOptionsInterface {
  public readonly serverless = true
  public readonly host = 'localhost'
  public readonly port = 3000

  constructor(options: TrapHandlerOptionsInterface) {
    Object.assign(this, options)
  }
}
