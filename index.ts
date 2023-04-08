import { checkPath } from './functions.ts'

const basePath = Deno.env.get('USERPROFILE')!

console.log()

await checkPath(basePath)

console.log()
