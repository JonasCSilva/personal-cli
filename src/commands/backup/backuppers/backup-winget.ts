import { writeFile } from '../utils/backuppers-functions.ts'
import { getConfig } from 'utils/getConfig.ts'

const config = await getConfig()

export default async function backup(path: string): Promise<void> {
  const command = new Deno.Command('winget', { args: ['list'], stdout: 'piped' })

  const child = command.spawn()

  const decoder = new TextDecoder()

  const { stdout } = await child.output()

  const rawOutStr = decoder.decode(stdout)

  const outStr = rawOutStr.replaceAll(/[^\w\d\s….()&{}-]/g, '')

  const firstLetterIndex = outStr.match('[a-zA-Z]')!.index!

  const rawLines = outStr.slice(firstLetterIndex).split('\r\n').filter((line) => line && !line.includes('-----------'))

  const lines = rawLines.filter((line) => {
    return config.b.ignore.every((ignore) => !line.includes(ignore))
  })

  const indexes: number[] = [...lines[0].matchAll(/[\w]+/g)].map((match) => match.index!)

  const [headers, ...main] = lines.map((line) => {
    const rawStrings = [
      line.substring(0, indexes[1]),
      line.substring(indexes[1], indexes[2]),
      line.substring(indexes[2], indexes[3]),
      line.substring(indexes[3]),
    ]

    const strings = rawStrings.filter((string) => string).map((string) => string.trim())

    return strings
  })

  const data = main.map((line) => line.reduce((obj, column, index) => ({ ...obj, [headers[index]]: column }), {}))

  await writeFile('winget', path, data)
}
