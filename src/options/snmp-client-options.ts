import assert from 'assert'
import { SnmpClientOptionsInterface } from '../types'
import { User } from '../user'

export class SnmpClientOptions implements SnmpClientOptionsInterface {
  public readonly host = 'localhost'
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
