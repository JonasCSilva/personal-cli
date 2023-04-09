import { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts'
import { checkFolders } from './check-folders/index.ts'
import { checkRepositories } from './check-repositories/index.ts'
import { zipOneDrive } from './zip-onedrive/7zipG.ts'

await new Command()
  .name('Personal CLI')
  .version('0.1.0')
  .versionOption('-v, --version', 'Show the version number.')
  .description('CLI for personal use')
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
  .command('zo', 'Zip OneDrive folder.')
  .action(async () => await zipOneDrive())
  // Parse
  .parse()
