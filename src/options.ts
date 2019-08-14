type SnmpVersion = '1' | '2c' | '3'

export interface SnmpClientOptionsInterface {
  host?: string
  port?: number
  version?: SnmpVersion
  community?: string
}

export class SnmpClientOptions implements SnmpClientOptionsInterface {
  host = '127.0.0.1'
  port = 161
  version: SnmpVersion = '2c'
  community = 'public'

  constructor(options: SnmpClientOptionsInterface) {
    Object.assign(this, options)
  }
}
