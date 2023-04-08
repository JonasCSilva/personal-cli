import { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts'
import { main } from './index.ts'

await new Command()
  .name('Check folders')
  .version('0.1.0')
  .description('Check folders for files')
  .command('cf', 'Check folders.')
  .action(async () => await main())
  .parse(Deno.args)
