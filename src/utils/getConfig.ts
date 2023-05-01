import defaultConfig from 'utils/config.json' assert { type: 'json' }
import { dirname, join } from 'path'
import { Config } from 'utils/types.ts'

export async function getConfig(): Promise<Config> {
  const execPath = Deno.execPath()

  const configPath = join(dirname(execPath), 'pc.config')

  let config = defaultConfig

  try {
    config = JSON.parse(await Deno.readTextFile(configPath))
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error
  }

  return config
}
