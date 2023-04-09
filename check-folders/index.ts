import { checkPath } from './functions.ts'
import { green, red } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

export async function checkFolders() {
  const basePath = Deno.env.get('USERPROFILE')!

  const results: string[] = []

  await checkPath(results, basePath)

  console.log()

  if (results.length > 0) {
    for (const result of results) {
      console.log(red(result))
    }
  } else {
    console.log(green('No files found!'))
  }

  console.log()
}
