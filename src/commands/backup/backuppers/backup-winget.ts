import { writeFile } from '../utils/backuppers-functions.ts'

export default async function backup(path: string): Promise<void> {
  const command = new Deno.Command('winget', { args: ['list' /* , '|', 'Sort-Object' */], stdout: 'piped' })

  const child = command.spawn()

  const decoder = new TextDecoder()

  const { stdout } = await child.output()

  const outStr = decoder.decode(stdout)

  const array = outStr.split('\r\n').filter((_) => _ && !_.includes('-----------')).map((_) =>
    _.replaceAll('…', '… ').split(/\s{2,}/g).filter((_) => _ && !_.includes('\b'))
  )

  const data = array.slice(1).map((_) => {
    const object: { [key: string]: string } = {}
    for (const [index, entry] of _.entries()) {
      object[array[0][index]] = entry
    }
    return object
  })

  await writeFile('winget', path, data)
}
