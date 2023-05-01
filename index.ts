import { Command } from 'cliffy'
import { checkFolders } from './src/commands/check-folders/index.ts'
import { checkRepositories } from './src/commands/check-repositories/index.ts'
import { showScripts } from './src/commands/show-scripts/index.ts'
import { readScript } from './src/commands/read-script/index.ts'
import { backup } from './src/commands/backup/index.ts'

await new Command()
  .name('pc')
  .version('0.1.2')
  .versionOption(
    '-v, --version',
    'Show the version number.',
    function (this: Command) {
      console.log(`\nVersion: ${this.getVersion()}\n`)
    },
  )
  .description('Custom CLI for personal use')
  // Main command
  .action(function (this: Command) {
    console.log(this.getHelp())
  })
  // Child command 1
  .command('cf', 'Check folders.')
  .action(async () => await checkFolders())
  // Child command 2
  .command('cr', 'Check repositories.')
  .arguments('[path:string]')
  .action(async (_options, arg) => await checkRepositories(arg))
  // Child command 3
  .command('ss', 'Show scripts.')
  .action(async () => await showScripts())
  // Child command 4
  .command('rs', 'Read script.')
  .arguments('<name:string>')
  .option("-v, --verbose", "Show full file.")
  .action(async (options, arg) => await readScript(arg, options))
  // Child command 5
  .command('b', 'Backup.')
  .action(async () => await backup())
  // Parse
  .parse()
