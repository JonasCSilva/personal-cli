import { basename, dirname, extname, join, parse } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { bold, green, red } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

export async function showScripts() {
  const execPath = Deno.execPath()

  const oneDrivePath = Deno.env.get('OneDrive')!

  const exec = basename(execPath)

  const binFolder = exec === 'deno.exe' ? join(oneDrivePath, 'bin') : dirname(execPath)

  const dir = Deno.readDir(binFolder)

  const scripts: string[] = []

  for await (const entry of dir) {
    if (extname(entry.name) === '.ps1') {
      scripts.push(parse(entry.name).name)
    }
  }

  console.log()
  if (scripts.length) {
    console.log(green(bold('Available scripts:\n')))

    for (const script of scripts) {
      console.log(green(script))
    }
  } else {
    console.log(red(bold('No available scripts')))
  }
  console.log()
}
