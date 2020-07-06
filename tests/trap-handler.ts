import { TrapHandler } from '..'

async function main(): Promise<void> {
  const handler = new TrapHandler({ serverless: false })

  handler.on('rawdata', (message) => {
    console.log(`Raw TRAP message from Germanium:`)
    console.log(message)
    console.log()
  })
  handler.on('data', (message) => {
    console.log(`Parsed TRAP message:`)
    console.log(message)
    console.log()
  })

  await handler.start()
}
main()
