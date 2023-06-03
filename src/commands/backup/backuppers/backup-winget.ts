import { writeFile } from '../utils/backuppers-functions.ts'
import { getConfig } from 'utils/getConfig.ts'

const config = await getConfig()

export default async function backup(path: string): Promise<void> {
  const command = new Deno.Command('winget', { args: ['list'], stdout: 'piped' })

  const child = command.spawn()

  const decoder = new TextDecoder()

  const { stdout } = await child.output()

  const outStr = decoder.decode(stdout)

  const rawArray = outStr.split('\r\n').filter((_) => _ && !_.includes('-----------'))

  const array = rawArray.filter((line) => {
    return config.b.ignore.every((ignore) => !line.includes(ignore))
  })

  const rawIndexes = array.map((_) => [_.indexOf('…'), _.lastIndexOf('…')])

  const indexes: number[] = []

  for (const [first, last] of rawIndexes) {
    if (first !== -1 && !indexes.includes(first)) indexes.push(first)
    if (last !== -1 && !indexes.includes(last)) indexes.push(last)
  }

  indexes.sort()

  const arrays = array.map((_) => {
    const first = _.substring(0, indexes[0] + 1).trim()

    const second = _.substring(indexes[0] + 2, indexes[1] + 1).trim()

    const rawThirdAndFourth = _.substring(indexes[1] + 2).trim()
    const thirdAndFourth = rawThirdAndFourth.split(/\s{2,}/g)

    const third = thirdAndFourth[0]
    const fourth = thirdAndFourth[1]

    const rawStrings = [first, second, third, fourth]

    const strings = []

    for (const rawString of rawStrings) {
      if (rawString) {
        strings.push(rawString)
      }
    }

    return strings
  })

  const header = arrays[0]
  header[0] = header[0].match(/[A-Z].+/)![0]

  const main = arrays.slice(1)

  const data = main.map((_) => {
    const object: { [key: string]: string } = {}

    for (const [index, entry] of _.entries()) {
      object[header[index]] = entry
    }

    return object
  })

  await writeFile('winget', path, data)
}
