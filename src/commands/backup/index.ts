import 'dotenv/load.ts'
import { basename, join } from 'path'
import backupGitHub from './backuppers/backup-github.ts'
import backupHabitica from './backuppers/backup-habitica.ts'
import backupScoop from './backuppers/backup-scoop.ts'
import backupWinget from './backuppers/backup-winget.ts'

export async function backup() {
  const execPath = Deno.execPath()

  const oneDrivePath = Deno.env.get('OneDrive')!

  const execName = basename(execPath)

  const backupPath = execName === 'deno.exe' ? join(Deno.cwd(), 'dist') : join(oneDrivePath, 'backups', 'programmatically')

  await Promise.all([
    backupGitHub(backupPath),
    backupHabitica(backupPath),
    backupScoop(backupPath),
    backupWinget(backupPath),
  ])
}
