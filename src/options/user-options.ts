import { UserOptionsInterface } from '../types'

export class UserOptions implements UserOptionsInterface {
  public readonly authPassword = ''
  public readonly authProtocol = 'MD5'
  public readonly privPassword = ''
  public readonly privProtocol = 'DES'

  constructor(options: UserOptionsInterface) {
    Object.assign(this, options)
  }
}
