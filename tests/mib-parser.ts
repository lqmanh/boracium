import { MibParser, OIDFormat } from '..'
import { benchmark } from './test-utils'

function translateOID(parser: MibParser, toFormat: OIDFormat): Promise<string> {
  return parser.translate('SNMPv2-MIB::system.sysUpTime.0', toFormat)
}

async function main(): Promise<void> {
  const parser = new MibParser()

  const [, t1] = await benchmark(translateOID)(parser, 'fullOID')
  console.log(`Translate an OID to full format: ${t1}ms`)

  const [, t2] = await benchmark(translateOID)(parser, 'numericOID')
  console.log(`Translate an OID to numeric format: ${t2}ms`)

  const [, t3] = await benchmark(translateOID)(parser, 'textualOID')
  console.log(`Translate an OID to textual format: ${t3}ms`)
}
main()
