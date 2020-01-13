import assert from 'assert'
import User from '../user'
import { SnmpVersion } from '../types'

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

    // yes, linter is too dumb to use this.options.version !== '3'
    if (['1', '2c'].includes(this.version))
      assert(this.community, 'Community not provided when using SNMP v1 and v2c')
    else assert(this.user, 'User not provided when using SNMP v3')
  }
}
