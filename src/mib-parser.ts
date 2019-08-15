import execa from 'execa'

export type OIDFormat = 'textualOID' | 'numericOID' | 'fullOID'

export default class MibParser {
  constructor() {}

  public async translate(oid: string, to: OIDFormat): Promise<string> {
    let opt = ''
    if (to === 'numericOID') opt = '-On'
    else if (to === 'fullOID') opt = '-Of'
    // else if (to === 'textualOID') opt = ''

    const { stdout, stderr } = await execa.command(`snmptranslate ${opt} ${oid}`)

    if (stderr) throw new Error(stderr)

    return stdout
  }
}
