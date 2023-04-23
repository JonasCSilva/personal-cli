import { ensureDir } from 'https://deno.land/std@0.182.0/fs/ensure_dir.ts'
import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { timeString } from '../utils/get-time-string.ts'
import { getZip } from '../utils/custom-zip.ts'

export default async function backup(path: string, oldPath: string, folderName: string): Promise<void> {
  const folderPath = join(path, folderName)

  const newPath = join(folderPath, `${folderName}-${timeString}.zip`)

  const zip = await getZip(oldPath)

  await ensureDir(folderPath)

  await Deno.writeFile(newPath, zip)
}
