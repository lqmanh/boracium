const { TrapHandler } = require('..')

const main = async () => {
  const handler = new TrapHandler({ host: 'localhost', port: 3000 })
  await handler.start()

  handler.on('rawdata', (trapMsg) => {
    console.log(trapMsg)
  })
  handler.on('data', (trapMsg) => {
    console.log(trapMsg)
  })
}

main()
