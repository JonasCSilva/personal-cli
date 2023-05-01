import { writeFile } from '../utils/backuppers-functions.ts'

export default async function backup(path: string): Promise<void> {
  const command = new Deno.Command('pwsh', { args: ['-c', 'scoop', 'export'], stdout: 'piped' })

  const child = command.spawn()

  const decoder = new TextDecoder()

  const { stdout } = await child.output()

  const outStr = decoder.decode(stdout)

  const data = JSON.parse(outStr)

  await writeFile('scoop', path, data, false)
}
