import { UserOptions, UserOptionsInterface } from './options'
import { AuthProtocol, PrivProtocol, SecurityLevel } from './types'

export class User {
  public readonly username: string
  private readonly options: UserOptions

  constructor(username: string, options: UserOptionsInterface) {
    this.username = username
    this.options = new UserOptions(options)
  }

  get authPassword(): string {
    return this.options.authPassword
  }

  get authProtocol(): AuthProtocol {
    return this.options.authProtocol
  }

  get privPassword(): string {
    return this.options.privPassword
  }

  get privProtocol(): PrivProtocol {
    return this.options.privProtocol
  }

  get securityLevel(): SecurityLevel {
    if (!this.options.authPassword) return 'noAuthNoPriv'
    if (!this.options.privPassword) return 'authNoPriv'
    return 'authPriv'
  }
}
