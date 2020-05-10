import assert from 'assert'
import { SnmpVersion } from '../types'
import { User } from '../user'

export interface SnmpClientOptionsInterface {
  host?: string
  port?: number
  version?: SnmpVersion
  community?: string
  user?: User
}

export class SnmpClientOptions implements SnmpClientOptionsInterface {
  public readonly host = 'localhost'
  public readonly port = 161
  public readonly version = '2c'
  public readonly community = 'public'
  public readonly user: User

  constructor(options: SnmpClientOptionsInterface) {
    Object.assign(this, options)

    if (['1', '2c'].includes(this.version))
      assert(this.community, 'Community not provided when using SNMP v1 and v2c')
    else assert(this.user, 'User not provided when using SNMP v3')
  }
}

export interface SnmpClientGetWithOptionsInterface {
  autoParse?: boolean
}

export class SnmpClientGetWithOptions implements SnmpClientGetWithOptionsInterface {
  public readonly autoParse = true

  constructor(options: SnmpClientGetWithOptionsInterface) {
    Object.assign(this, options)
  }
}
