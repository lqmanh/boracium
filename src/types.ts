export type AuthProtocol = 'MD5' | 'SHA' | 'SHA-512' | 'SHA-384' | 'SHA-256' | 'SHA-224'

export type OIDFormat = 'textualOID' | 'numericOID' | 'fullOID'

export type PrivProtocol = 'DES' | 'AES'

export type SecurityLevel = 'noAuthNoPriv' | 'authNoPriv' | 'authPriv'

export type SnmpGetBinary = 'snmpget' | 'snmpgetnext' | 'snmpbulkget' | 'snmpwalk'

export type SnmpVersion = '1' | '2c' | '3'

export interface RawVarbindInterface {
  oid: string
  type: string
  value: string
}

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
