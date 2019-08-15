import User from '../user'

export type SnmpVersion = '1' | '2c' | '3'

export interface SnmpClientOptionsInterface {
  host?: string
  port?: number
  version?: SnmpVersion
  community?: string
  user?: User
}

export class SnmpClientOptions implements SnmpClientOptionsInterface {
  public readonly host = '127.0.0.1'
  public readonly port = 161
  public readonly version = '2c'
  public readonly community = 'public'
  public readonly user: User

  constructor(options: SnmpClientOptionsInterface) {
    Object.assign(this, options)
  }
}
