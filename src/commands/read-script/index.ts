import { basename, dirname, join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { blue, bold, red } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

export async function readScript(fileName: string, { verbose }: { verbose?: true }) {
  const execPath = Deno.execPath()

  const oneDrivePath = Deno.env.get('OneDrive')!

  const exec = basename(execPath)

  const binFolder = exec === 'deno.exe' ? join(oneDrivePath, 'bin') : dirname(execPath)

  try {
    const file = await Deno.readTextFile(join(binFolder, `${fileName}.ps1`))

    if (verbose) {
      console.log(blue(`\n${file}\n`))
    } else {
      const lines = file.split('\r\n').filter((_) => _).map((_) => _.trim())

      const line = lines.find((_) => _.startsWith('$command'))!

      console.log(blue(`\n${line.slice(line.indexOf('"') + 1, -1)}\n`))
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw (error)

    console.log(red(bold('\nFile not found\n')))
  }
}
