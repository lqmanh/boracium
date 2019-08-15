export type AuthProtocol = 'MD5' | 'SHA' | 'SHA-512' | 'SHA-384' | 'SHA-256' | 'SHA-224'
export type PrivProtocol = 'DES' | 'AES'

export interface UserOptionsInterface {
  authPassword?: string
  authProtocol?: AuthProtocol
  privPassword?: string
  privProtocol?: PrivProtocol
}

export class UserOptions implements UserOptionsInterface {
  public readonly authPassword = ''
  public readonly authProtocol = 'MD5'
  public readonly privPassword = ''
  public readonly privProtocol = 'DES'

  constructor(options: UserOptionsInterface) {
    Object.assign(this, options)
  }
}
