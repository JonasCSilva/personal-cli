import { join } from 'path'
import { bold, red } from 'fmt/colors.ts'

export type GetStrings = (repositoriesPath: string, dir: AsyncIterable<Deno.DirEntry>) => Promise<string[]>

export const getStrings: GetStrings = async (repositoriesPath, dir) => {
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

      const lines = outStr.split('\n').filter((_) => _)

      return getString(dirEntry.name, lines)
    })

    promises.push(promise)
  }

  return Promise.all(promises)
}

function getString(entryName: string, lines: string[]) {
  let string = bold(`${entryName}:`)

  for (const [index, line] of lines.entries()) {
    if (index === 0) {
      const indexOf = line.indexOf('[')
      if (indexOf === -1) {
        string += `\n  ${line}`
      } else {
        string += `\n  ${line.substring(0, indexOf)}${red(line.substring(indexOf))}`
      }
    } else {
      string += red(`\n  ${line}`)
    }
  }

  return `\n${string}\n`
}
