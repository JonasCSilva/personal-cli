import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'
import { readLines, writeAll } from 'https://deno.land/std@0.104.0/io/mod.ts'

export async function zipOneDrive() {
  const oneDriveFolder = Deno.env.get('OneDrive')!

  const cmd = Deno.run({
    cmd: [
      '7z',
      'u',
      'OneDrive',
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

  const encoder = new TextEncoder()

  for await (const line of readLines(cmd.stdout)) {
    // console.log(line)
    Deno.stdout.write(encoder.encode(line))
    // await writeAll(Deno.stdout, encoder.encode(`${line}\n`))
  }

  for await (const line of readLines(cmd.stderr)) {
    // console.log(line)
    Deno.stdout.write(encoder.encode(line))
    // await writeAll(Deno.stdout, encoder.encode(`${line}\n`))
  }
}

await zipOneDrive()
