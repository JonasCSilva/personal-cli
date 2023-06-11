import 'dotenv/load.ts'
import { red } from 'fmt/colors.ts'
import { getConfig } from 'utils/getConfig.ts'

export async function getEnvValue(env: string): Promise<string> {
  const value = Deno.env.get(env) || await getConfig().then((config) => config.b?.env?.[env])

  if (!value) {
    console.log(red(`No ${env} set`))
    Deno.exit()
  }

  return value
}
