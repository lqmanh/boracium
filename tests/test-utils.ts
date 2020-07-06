export function benchmark(testFunc: Function): Function {
  const wrapper = async (...args): Promise<[unknown, number]> => {
    const start = Date.now()
    const result = await testFunc(...args)
    const end = Date.now()
    return [result, end - start]
  }
  return wrapper
}
