import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'
import { readLines } from 'https://deno.land/std@0.84.0/io/mod.ts'

const oneDriveFolder = Deno.env.get('OneDrive')!

const cmd = Deno.run({
  cmd: [
    '7z',
    'a',
    'OneDrive',
    join(oneDriveFolder, '*'),
    '-tzip',
    '-bsp1',
    '-x!desktop.ini',
    '-x!Cofre Pessoal.lnk',
    '-x!.849C9593-D756-4E56-8D6E-42412F2A707B',
  ],
  stdout: 'piped',
  stderr: 'piped',
})

for await (const line of readLines(cmd.stdout)) {
  console.log(line)
}

for await (const line of readLines(cmd.stderr)) {
  console.log(line)
}

// import { writeAll } from 'https://deno.land/std@0.104.0/io/mod.ts'
// const encoder = new TextEncoder()
// Deno.stdout.write(encoder.encode(line));
// await writeAll(Deno.stdout, encoder.encode(`${line}\n`))
