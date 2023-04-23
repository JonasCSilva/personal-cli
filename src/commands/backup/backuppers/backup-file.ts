import { ensureDir } from 'https://deno.land/std@0.182.0/fs/ensure_dir.ts'
import { extname, join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { timeString } from '../utils/get-time-string.ts'

export default async function backup(path: string, oldPath: string, folderName: string): Promise<void> {
  const folderPath = join(path, folderName)

  const ext = extname(oldPath)

  const newPath = join(folderPath, `${folderName}-${timeString}${ext}`)

  await ensureDir(folderPath)

  await Deno.copyFile(oldPath, newPath)
}
