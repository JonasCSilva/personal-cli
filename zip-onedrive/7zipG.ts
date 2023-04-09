import { green, red } from 'https://deno.land/std@0.170.0/fmt/colors.ts'
import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'

export async function zipOneDrive() {
  const oneDriveFolder = Deno.env.get('OneDrive')!
  const home = Deno.env.get('USERPROFILE')!

  const cmd = Deno.run({
    cmd: [
      '7zg',
      'u',
      join(home, 'OneDrive'),
      join(oneDriveFolder, '*'),
      '-tzip',
      '-bsp1',
      '-uq0',
      '-x!desktop.ini',
      '-x!Cofre Pessoal.lnk',
      '-x!.849C9593-D756-4E56-8D6E-42412F2A707B',
    ],
    stdout: 'piped',
    stderr: 'piped',
  })

  const { success } = await cmd.status()

  const string = success ? green('Successful!') : red('Failed!')

  console.log(`\n${string}\n`)
}
