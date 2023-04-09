import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { Uint8ArrayReader, Uint8ArrayWriter, ZipWriter } from 'https://deno.land/x/zipjs@v2.6.83/index.js'

const zipFileWriter = new Uint8ArrayWriter()
const zipWriter = new ZipWriter(zipFileWriter)

async function recursive(path: string) {
  const dir = Deno.readDir(path)
  for await (const entry of dir) {
    if (entry.isFile) {
      const file = await Deno.readFile(join(path, entry.name))
      await zipWriter.add(join(path, entry.name), new Uint8ArrayReader(file))
    } else if (entry.isDirectory) {
      await recursive(join(path, entry.name))
    }
  }
}

await recursive('./')

const zip = await zipWriter.close()
await Deno.writeFile('./custom.zip', zip)
