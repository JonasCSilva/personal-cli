import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { ignoreFiles, ignorePaths } from './ignore.ts'

export async function checkPath(currentPath: string, basePath?: string): Promise<void> {
  basePath ??= currentPath

  const dir = Deno.readDir(currentPath)

  for await (const entry of dir) {
    const entryPath = join(currentPath, entry.name)

    if (entry.isSymlink) continue
    if (isIgnoredPath(join(currentPath, entry.name), basePath)) continue
    if (isIgnoredFile(entry.name)) continue
    if (entry.isFile) console.log(entryPath)
    if (entry.isDirectory) await checkPath(entryPath, basePath)
  }
}

const isIgnoredPath = (entryPath: string, basePath: string): boolean => {
  for (const ignorePath of ignorePaths) {
    if (join(basePath, ignorePath) === entryPath) {
      return true
    }
  }
  return false
}

const isIgnoredFile = (entryName: string): boolean => {
  return ignoreFiles.includes(entryName)
}
