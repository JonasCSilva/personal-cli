import backupGitHub from './backuppers/backup-github.ts'
import backupHabitica from './backuppers/backup-habitica.ts'
import backupScoop from './backuppers/backup-scoop.ts'
import backupWinget from './backuppers/backup-winget.ts'
import backupSpotify from './backuppers/backup-spotify/index.ts'
import { getBackupPath } from '../../utils/getPaths.ts'

export async function backup() {
  const backupPath = await getBackupPath()

  await Promise.all([
    backupSpotify(backupPath),
    backupGitHub(backupPath),
    backupHabitica(backupPath),
    backupScoop(backupPath),
    backupWinget(backupPath),
  ])
}
