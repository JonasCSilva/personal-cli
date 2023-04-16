import { green, red, yellow } from 'https://deno.land/std@0.182.0/fmt/colors.ts'
import { join, resolve } from 'https://deno.land/std@0.182.0/path/mod.ts'

export async function zipOneDrive(path?: string) {
  const oneDriveFolder = Deno.env.get('OneDrive')!
  const home = Deno.env.get('USERPROFILE')!

  const filesPath = join(oneDriveFolder, '*')
  const archivePath = join(path ? resolve(path) : join(home, 'Desktop'), 'OneDrive.zip')

  const child = Deno.run({
    cmd: [
      '7z',
      'u',
      archivePath,
      filesPath,
      '-uq0',
      '-tzip',
      '-bsp1',
      '-sccUTF-8',
      '-x!desktop.ini',
      '-x!Cofre Pessoal.lnk',
      '-x!.849C9593-D756-4E56-8D6E-42412F2A707B',
    ],
    stdout: 'piped',
    stderr: 'piped',
  })

  const encoder = new TextEncoder()

  const lines = child.stdout.readable.pipeThrough(new TextDecoderStream())

  for await (const line of lines) {
    let string = line
    const index = line.indexOf('%')
    if (index !== -1) {
      string = `${line.substring(0, index - 2)}${yellow(line.substring(index - 2, index + 1))}${line.substring(index + 1)}`
    } else if (line.includes('Everything is Ok')) {
      string = green(line)
    } else {
      let index = line.indexOf('Scan WARNINGS')
      index = index !== -1 ? index : line.indexOf('WARNINGS')
      if (index !== -1) {
        string = `${line.substring(0, index)}${red(line.substring(index))}`
      }
    }

    Deno.stdout.write(encoder.encode(string))
  }
}
