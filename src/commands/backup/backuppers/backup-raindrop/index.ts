import { getEnvValue } from 'utils/get-env-value.ts'
import { writeFile } from '../../utils/backuppers-functions.ts'

type Bookmark = {
  link: string
  title: string
  [key: string]: unknown
}

export default async function backup(path: string): Promise<void> {
  const RAINDROP_TOKEN = await getEnvValue('RAINDROP_TOKEN')

  const requestConfig: RequestInit = {
    headers: { Authorization: `Bearer ${RAINDROP_TOKEN}` },
  }

  const response = await fetch('https://api.raindrop.io/rest/v1/raindrops/0', requestConfig)

  const { items } = await response.json()

  const bookmarks = items.map(({ link, title }: Bookmark) => ({ link, title }))

  await writeFile('raindrop', path, bookmarks)
}
