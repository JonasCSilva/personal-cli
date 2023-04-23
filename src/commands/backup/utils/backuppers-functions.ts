import { ensureDir } from 'https://deno.land/std@0.181.0/fs/mod.ts'
import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'
import { timeString } from './get-time-string.ts'

type ZipData = { name: string; body: ReadableStream<Uint8Array> }[]

export const writeFile = async (name: string, path: string, data: unknown): Promise<void> => {
  const folderPath = join(path, name)
  await ensureDir(folderPath)

  name = `${name}-${timeString}`

  const value = { name, data }

  await Deno.writeTextFile(
    join(folderPath, `${name}.json`),
    JSON.stringify(value, undefined, 2),
  )
}

export const writeZips = async (name: string, path: string, data: ZipData): Promise<void> => {
  const folderPath = join(path, name, name + '-' + timeString)
  await ensureDir(folderPath)

  if (!data) {
    throw new Error('No data!')
  }

  const promises: Promise<unknown>[] = []

  for (const { name, body } of data) {
    promises.push(Deno.writeFile(join(folderPath, `${name.split('/').at(-1)}-${timeString}.zip`), body))
  }

  await Promise.all(promises)
}
