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
