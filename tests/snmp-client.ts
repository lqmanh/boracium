import { SnmpClient, User, VarbindInterface } from '..'
import { benchmark } from './test-utils'

function sendGET(client: SnmpClient): Promise<VarbindInterface[]> {
  return client.get('SNMPv2-MIB::system.sysUpTime.0')
}

function sendGETNEXT(client: SnmpClient): Promise<VarbindInterface[]> {
  return client.getNext('SNMPv2-MIB::system.sysUpTime.0')
}

function sendGETBULK(client: SnmpClient): Promise<VarbindInterface[]> {
  return client.getBulk('SNMPv2-MIB::system.sysUpTime.0')
}

function walkMIBTree(client: SnmpClient): Promise<VarbindInterface[]> {
  return client.walk()
}

async function main(): Promise<void> {
  const client1 = new SnmpClient({
    host: 'localhost',
    version: '2c',
    community: 'light_ro',
  })
  const client2 = new SnmpClient({
    host: 'localhost',
    version: '3',
    user: new User('light_user_ro', {
      authProtocol: 'MD5',
      authPassword: 'light_ro',
      privProtocol: 'DES',
      privPassword: 'light_ro',
    }),
  })

  const [, t1] = await benchmark(sendGET)(client1)
  console.log(`Send a GET request: ${t1}ms`)

  const [, t2] = await benchmark(sendGETNEXT)(client2)
  console.log(`Send a GETNEXT request: ${t2}ms`)

  const [, t3] = await benchmark(sendGETBULK)(client1)
  console.log(`Send a GETBULK request: ${t3}ms`)

  const [, t4] = await benchmark(walkMIBTree)(client2)
  console.log(`Walk entire MIB tree: ${t4}ms`)
}
main()
