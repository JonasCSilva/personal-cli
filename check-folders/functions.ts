import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import defaultConfig from '../config.json' assert { type: 'json' }
import { red } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

const execPath = Deno.execPath()

const configPath = join(execPath, '..', 'pc.config')

let config = defaultConfig

try {
  config = JSON.parse(await Deno.readTextFile(configPath))
} catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) throw error
}

const { files: ignoreFiles, paths: rawIgnorePaths } = config.cf.ignore

const ignorePaths = rawIgnorePaths.map((rawIgnorePath: string | string[]) =>
  Array.isArray(rawIgnorePath) ? join(...rawIgnorePath) : rawIgnorePath
)

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
  return ignorePaths.some((ignorePath: string): boolean => join(basePath, ignorePath) === entryPath)
}

const isIgnoredFile = (entryName: string): boolean => {
  return ignoreFiles.includes(entryName)
}
