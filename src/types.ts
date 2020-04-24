import { User } from './user'

export type AuthProtocol = 'MD5' | 'SHA' | 'SHA-512' | 'SHA-384' | 'SHA-256' | 'SHA-224'

export type OIDFormat = 'textualOID' | 'numericOID' | 'fullOID'

export interface ParsedSnmpResponse {
  textualOID: string
  type?: string
  value: string
}

export type PrivProtocol = 'DES' | 'AES'

export type SecurityLevel = 'noAuthNoPriv' | 'authNoPriv' | 'authPriv'

export type SnmpGetBinary = 'snmpget' | 'snmpgetnext' | 'snmpbulkget'

export type SnmpVersion = '1' | '2c' | '3'

export interface VarbindInterface {
  numericOID: string
  textualOID: string
  fullOID: string
  type: string
  value: string
}

export interface RawTrapMessage {
  remote_hostname: string
  transport_address: {
    protocol: string
    remote_address: string
    local_address: string
  }
  varbinds: { oid: string; value: string }[]
  timestamp: string
}

export interface ParsedTrapMessage {
  remoteHostname: string
  transportAddress: {
    protocol: string
    remoteAddress: string
    localAddress: string
  }
  varbinds: VarbindInterface[]
  timestamp: Date
}

export interface SnmpClientOptionsInterface {
  host?: string
  port?: number
  version?: SnmpVersion
  community?: string
  user?: User
}

export interface TrapHandlerOptionsInterface {
  serverless?: boolean
  host?: string
  port?: number
}

export interface UserOptionsInterface {
  authPassword?: string
  authProtocol?: AuthProtocol
  privPassword?: string
  privProtocol?: PrivProtocol
}
