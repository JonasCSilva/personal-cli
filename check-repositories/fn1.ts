import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'

export type Fn = (repositoriesPath: string, dir: AsyncIterable<Deno.DirEntry>) => Promise<string[]>

export const fn: Fn = async (repositoriesPath, dir) => {
  const promises = []

  for await (const dirEntry of dir) {
    const p = Deno.run({
      cmd: ['git', '-C', join(repositoriesPath, dirEntry.name), 'fetch', '--all'],
    })

    const promise = p.status().then(async () => {
      const cmd = Deno.run({
        cmd: ['git', '-C', join(repositoriesPath, dirEntry.name), 'status', '-b', '--porcelain'],
        stdout: 'piped',
        stderr: 'piped',
      })

      const output = await cmd.output()
      const outStr = new TextDecoder().decode(output)

      return `\n%c${dirEntry.name}:\n%c${outStr}`
    })

    promises.push(promise)
  }

  return Promise.all(promises)
}
