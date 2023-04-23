import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from 'https://deno.land/x/zipjs@v2.6.83/index.js'

async function recursive(path: string, zipWriter: ZipWriter<Uint8Array>) {
  const dir = Deno.readDir(path)
  for await (const entry of dir) {
    if (entry.isFile) {
      const file = await Deno.readFile(join(path, entry.name))
      await zipWriter.add(join(path, entry.name), new Uint8ArrayReader(file))
    } else if (entry.isDirectory) {
      await recursive(join(path, entry.name), zipWriter)
    }
  }
}

export async function getZip(path: string) {
  const zipFileWriter = new Uint8ArrayWriter()
  const zipWriter = new ZipWriter(zipFileWriter)

  await recursive(path, zipWriter)

  const zip = await zipWriter.close()

  return zip
}
