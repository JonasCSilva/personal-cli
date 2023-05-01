import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
import { getStrings } from './functions.ts'

export async function checkRepositories(argPath = 'repositories') {
  const home = Deno.env.get('USERPROFILE')!

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
