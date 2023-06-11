import { join } from 'path'
import { getStrings } from './functions.ts'
import { getEnvValue } from 'utils/get-env-value.ts'

export async function checkRepositories(argPath = 'repositories') {
  const home = await getEnvValue('USERPROFILE')!

  const repositoriesPath = join(home, argPath)

  try {
    const dir = Deno.readDir(repositoriesPath)

    const strings = await getStrings(repositoriesPath, dir)

    console.log(...strings)
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error
    }

    console.log(
      '\n%cFolder not found!\n',
      'font-weight: bold; color: red',
    )
  }
}
