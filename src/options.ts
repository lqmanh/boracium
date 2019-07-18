export interface SnmpClientOptionsInterface {
  host?: string
  port?: number
  version?: '1' | '2c' | '3'
  community?: string
}

export class SnmpClientOptions implements SnmpClientOptionsInterface {
  host = '127.0.0.1'
  port = 161
  version: '1' | '2c' | '3' = '2c'
  community = 'public'

  constructor(options: SnmpClientOptionsInterface) {
    Object.assign(this, options)
  }
}
