import { basename, join, relative } from 'path'
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from 'zipjs'

async function recursive(zipWriter: ZipWriter<Uint8Array>, basePath: string, path: string = basePath) {
  const dir = Deno.readDir(path)

  for await (const entry of dir) {
    if (entry.isFile) {
      const file = await Deno.readFile(join(path, entry.name))

      const relativePath = relative(basePath, join(path, entry.name))

      await zipWriter.add(join(basename(basePath), relativePath), new Uint8ArrayReader(file))
    } else if (entry.isDirectory) {
      await recursive(zipWriter, basePath, join(path, entry.name))
    }
  }
}

export async function getZip(path: string) {
  const zipFileWriter = new Uint8ArrayWriter()
  const zipWriter = new ZipWriter(zipFileWriter)

  await recursive(zipWriter, path)

  const zip = await zipWriter.close()

  return zip
}
