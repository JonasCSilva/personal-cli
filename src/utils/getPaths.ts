import { basename, dirname, join } from 'path'
import { getEnvValue } from 'utils/get-env-value.ts'

export async function getBackupPath() {
  const execPath = Deno.execPath()

  const oneDrivePath = await getEnvValue('OneDrive')!

  const execName = basename(execPath)

  const backupPath = execName === 'deno.exe' ? join(Deno.cwd(), 'dist') : join(oneDrivePath, 'backups', 'programmatically')

  return backupPath
}

export async function getBinPath() {
  const execPath = Deno.execPath()

  const oneDrivePath = await getEnvValue('OneDrive')!

  const execName = basename(execPath)

  const binPath = execName === 'deno.exe' ? join(oneDrivePath, 'bin') : dirname(execPath)

  return binPath
}
