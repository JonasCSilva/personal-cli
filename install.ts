import { green, red } from 'https://deno.land/std@0.182.0/fmt/colors.ts'
import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'

const child = Deno.run({ cmd: ['deno', 'task', 'compile'] })

const { success } = await child.status()

const string = success ? green('Compile successful') : red('compile failed')

console.log(`\n${string}\n`)

if (!success) Deno.exit()

const oneDriveFolder = Deno.env.get('OneDrive')!
const cwd = Deno.cwd()

await Deno.rename(join(cwd, 'pc.exe'), join(oneDriveFolder, 'bin', 'pc.exe'))

console.log(green(`File moved\n`))
