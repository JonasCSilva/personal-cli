import { writeFile } from '../utils/backuppers-functions.ts'

// Add ignore

/*
Windows Package Manager Source (winget)
Telegram Desktop

indexof …
*/

export default async function backup(path: string): Promise<void> {
  const child = Deno.run({ cmd: ['winget', 'list' /* , '|', 'Sort-Object' */], stdout: 'piped' })

  const decoder = new TextDecoder()

  const output = await child.output()

  const outStr = decoder.decode(output)

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
