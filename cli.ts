import { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts'
import { checkFolders } from './check-folders/index.ts'
import { checkRepositories } from './check-repositories/index.ts'

await new Command()
  // Main command
  .name('Check folders')
  .version('0.1.0')
  .description('Check folders for files')
  // Child command 1
  .command('cf', 'Check folders.')
  .action(async () => await checkFolders())
  // Child command 2
  .command('cr', 'Check repositories.')
  .arguments('[path:string]')
  .action(async (_options, arg) => await checkRepositories(arg))
  // Parse
  .parse(Deno.args)
