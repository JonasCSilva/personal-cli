import { checkPath } from './functions.ts'
import { green } from 'https://deno.land/std@0.182.0/fmt/colors.ts'

export async function checkFolders() {
  const basePath = Deno.env.get('USERPROFILE')!

  const results = await checkPath(basePath)

  let string = results.join('\n')

  if (!results.length) {
    string = green('No files found!')
  }

  console.log(`\n${string}\n`)
}
