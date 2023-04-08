import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { ignoreFiles, ignorePaths } from './ignore.ts'

const basePath = Deno.env.get('USERPROFILE')!

const isIgnoredPath = (entryPath: string) => {
  for (const ignorePath of ignorePaths) {
    if (join(basePath, ignorePath) === entryPath) {
      return true
    }
  }
  return false
}

const isIgnoredFile = (entryName: string) => ignoreFiles.includes(entryName)

checkPath(basePath)

async function checkPath(path: string) {
  const dir = Deno.readDir(path)

  for await (const entry of dir) {
    const entryPath = join(path, entry.name)

    if (entry.isSymlink) continue
    if (isIgnoredPath(join(path, entry.name))) continue
    if (isIgnoredFile(entry.name)) continue
    if (entry.isFile) console.log(entryPath)
    if (entry.isDirectory) checkPath(entryPath)
  }
}
