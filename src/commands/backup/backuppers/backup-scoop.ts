import { writeFile } from '../utils/backuppers-functions.ts'

export default async function backup(path: string): Promise<void> {
  const child = Deno.run({ cmd: ['pwsh', '-c', 'scoop', 'export'], stdout: 'piped' })

  const decoder = new TextDecoder()

  const output = await child.output()

  const outStr = decoder.decode(output)

  const data = JSON.parse(outStr)

  await writeFile('scoop', path, data)
}
