import { join } from 'https://deno.land/std@0.181.0/path/mod.ts'
import { fn as fn1 } from './lib/fn1.ts'
import { fn as fn2 } from './lib/fn2.ts'

const home = Deno.env.get('USERPROFILE')!
const repositoriesPath = join(home, 'repositories')
const dir = Deno.readDir(repositoriesPath)

Deno.bench('fn1', { group: 'fn' }, async () => {
  await fn1(repositoriesPath, dir)
})

Deno.bench('fn2', { group: 'fn' }, async () => {
  await fn2(repositoriesPath, dir)
})
