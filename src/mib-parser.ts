import execa from 'execa'
import { OIDFormat, RawVarbindInterface, VarbindInterface } from './types'

export class MibParser {
  public async translate(oid: string, to: OIDFormat): Promise<string> {
    let opt = ''
    if (to === 'numericOID') opt = '-On'
    else if (to === 'fullOID') opt = '-Of'
    // else if (to === 'textualOID') opt = ''

    const { stdout, stderr } = await execa.command(`snmptranslate ${opt} ${oid}`)

    if (stderr) throw new Error(stderr)

    return stdout
  }

  public async parseRawVarbind(varbind: RawVarbindInterface): Promise<VarbindInterface> {
    const { oid, type, value } = varbind
    const [numericOID, textualOID, fullOID] = await Promise.all([
      this.translate(oid, 'numericOID'),
      this.translate(oid, 'textualOID'),
      this.translate(oid, 'fullOID'),
    ])
    return { numericOID, textualOID, fullOID, type, value }
  }
}
