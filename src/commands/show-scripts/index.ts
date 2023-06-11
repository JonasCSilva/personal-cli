import { extname, parse } from 'path'
import { bold, green, red } from 'fmt/colors.ts'
import { getBinPath } from 'utils/getPaths.ts'

export async function showScripts() {
  const binPath = await getBinPath()

  const dir = Deno.readDir(binPath)

  const scripts: string[] = []

  for await (const entry of dir) {
    if (extname(entry.name) === '.ps1') {
      const scriptName = parse(entry.name).name

      scripts.push(scriptName)
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
