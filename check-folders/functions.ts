import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import ignore from './ignore.json' assert { type: 'json' }
import { red } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

const { files: ignoreFiles, paths: rawIgnorePaths } = ignore

const ignorePaths = rawIgnorePaths.map((rawIgnorePath) => Array.isArray(rawIgnorePath) ? join(...rawIgnorePath) : rawIgnorePath)

type CheckPath = (currentPath: string, basePath?: string, results?: string[]) => Promise<string[]>

export const checkPath: CheckPath = async (currentPath, basePath = currentPath, results = []) => {
  const dir = Deno.readDir(currentPath)

  for await (const entry of dir) {
    const entryPath = join(currentPath, entry.name)

    if (entry.isSymlink) continue
    if (isIgnoredPath(join(currentPath, entry.name), basePath)) continue
    if (isIgnoredFile(entry.name)) continue
    if (entry.isFile) results.push(red(entryPath))
    if (entry.isDirectory) {
      results = await checkPath(entryPath, basePath, results)
    }
  }

  return results
}

const isIgnoredPath = (entryPath: string, basePath: string): boolean => {
  return ignorePaths.some((ignorePath): boolean => join(basePath, ignorePath) === entryPath)
}

const isIgnoredFile = (entryName: string): boolean => {
  return ignoreFiles.includes(entryName)
}
