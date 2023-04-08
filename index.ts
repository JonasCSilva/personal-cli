import { checkPath } from './functions.ts'

export async function main() {
  const basePath = Deno.env.get('USERPROFILE')!
  
  const results: string[] = []
  
  await checkPath(results, basePath)
  
  console.log()
  
  if (results.length > 0) {
    for (const result of results) {
      console.log(result)
    }
  } else {
    console.log('No files found!')
  }
  
  console.log()
}
