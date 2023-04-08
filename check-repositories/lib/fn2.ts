import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'
import { Fn } from './types.ts'

export const fn: Fn = async (repositoriesPath, dir) => {
  const strings = []

  for await (const dirEntry of dir) {
    const p = Deno.run({
      cmd: ['git', '-C', join(repositoriesPath, dirEntry.name), 'fetch', '--all'],
    })

    await p.status()

    const cmd = Deno.run({
      cmd: ['git', '-C', join(repositoriesPath, dirEntry.name), 'status', '-b', '--porcelain'],
      stdout: 'piped',
      stderr: 'piped',
    })

    const output = await cmd.output()
    const outStr = new TextDecoder().decode(output)

    strings.push(`\n%c${dirEntry.name}:\n%c${outStr}`)
  }

  return strings
}
