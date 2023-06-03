import { basename, dirname, join } from 'path'

export function getBackupPath() {
  const execPath = Deno.execPath()

  const oneDrivePath = Deno.env.get('OneDrive')!

  const execName = basename(execPath)

  const backupPath = execName === 'deno.exe' ? join(Deno.cwd(), 'dist') : join(oneDrivePath, 'backups', 'programmatically')

  return backupPath
}

export function getBinPath() {
  const execPath = Deno.execPath()

  const oneDrivePath = Deno.env.get('OneDrive')!

  const execName = basename(execPath)

  const binPath = execName === 'deno.exe' ? join(oneDrivePath, 'bin') : dirname(execPath)

  return binPath
}
