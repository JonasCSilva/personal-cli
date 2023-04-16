import { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts'
import { checkFolders } from './check-folders/index.ts'
import { checkRepositories } from './check-repositories/index.ts'
import { zipOneDrive } from './zip-onedrive/7zip.ts'

await new Command()
  .name('pc')
  .version('0.1.2')
  .versionOption('-v, --version', 'Show the version number.', function (this: Command) {
    console.log(`\nVersion: ${this.getVersion()}\n`)
  })
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
  .command('zo', 'Zip OneDrive folder.')
  .arguments('[path:string]')
  .action(async (_options, arg) => await zipOneDrive(arg))
  // Parse
  .parse()
