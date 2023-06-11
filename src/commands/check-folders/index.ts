import { getEnvValue } from 'utils/get-env-value.ts'
import { checkPath } from './functions.ts'
import { green } from 'fmt/colors.ts'

export async function checkFolders() {
  const basePath = await getEnvValue('USERPROFILE')!

  const results = await checkPath(basePath)

  let string = results.join('\n')

  if (!results.length) {
    string = green('No files found!')
  }

  console.log(`\n${string}\n`)
}
