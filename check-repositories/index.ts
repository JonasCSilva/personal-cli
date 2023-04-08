import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'
import { fn } from './lib/fn1.ts'

export async function checkRepositories(argPath?: string) {
  const home = Deno.env.get('USERPROFILE')!

  argPath ??= 'repositories'

  if (typeof argPath !== 'string') {
    console.log(
      '\n%cSpecify a path relative to the home folder!\n',
      'font-weight: bold; color: red',
    )

    Deno.exit()
  }

  const repositoriesPath = join(home, argPath)

  try {
    const dir = Deno.readDir(repositoriesPath)

    const strings = await fn(repositoriesPath, dir)

    for (const string of strings) {
      console.log(string, 'font-weight: bold', 'font-weight: normal')
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error
    }

    console.log(
      '\n%cFolder not found!\n',
      'font-weight: bold; color: red',
    )

    Deno.exit()
  }
}
