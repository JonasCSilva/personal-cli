import { basename, dirname, join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { blue } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

export async function readScript(fileName: string) {
  const execPath = Deno.execPath()

  const oneDrivePath = Deno.env.get('OneDrive')!

  const exec = basename(execPath)

  const binFolder = exec === 'deno.exe' ? join(oneDrivePath, 'bin') : dirname(execPath)

  const file = await Deno.readTextFile(join(binFolder, `${fileName}.ps1`))

  console.log(blue(`\n${file}`))
}