import { join } from 'path'
import { red } from 'fmt/colors.ts'
import { getConfig } from 'utils/getConfig.ts'

const config = await getConfig()

const { files: ignoreFiles, paths: rawIgnorePaths } = config.cf.ignore

const ignorePaths = rawIgnorePaths.map((rawIgnorePath: string | string[]): string =>
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
