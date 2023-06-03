import { join } from 'path'
import { blue, bold, red } from 'fmt/colors.ts'
import { getBinPath } from '../../utils/getPaths.ts'

export async function readScript(fileName: string, { verbose }: { verbose?: true }) {
  const binPath = getBinPath()

  try {
    const file = await Deno.readTextFile(join(binPath, `${fileName}.ps1`))

    if (verbose) {
      console.log(blue(`\n${file.slice(1)}\n`))
      Deno.exit()
    }

    const rawLines = file.split('\r\n')

    const lines = rawLines.filter((_) => _).map((_) => _.trim())

    const line = lines.find((_) => _.startsWith('$command'))!

    const commandStartIndex = line.indexOf('"')

    console.log(blue(`\n${line.slice(commandStartIndex + 1, -1)}\n`))
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw (error)
    }

    console.log(red(bold('\nFile not found\n')))
  }
}
