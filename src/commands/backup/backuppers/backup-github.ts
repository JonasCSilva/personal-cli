import { writeZips } from '../utils/backuppers-functions.ts'
import { getEnvValue } from '../utils/get-env-value.ts'

export default async function backup(path: string): Promise<void> {
  const GITHUB_TOKEN = await getEnvValue('GITHUB_TOKEN')

  const requestInit: RequestInit = {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }

  const response = await fetch('https://api.github.com/user/repos', requestInit).then((response) => response.json())

  const names: [string] = response.map(({ full_name }: { full_name: string }) => full_name)

  const data = await Promise.all(
    names.map((name) =>
      fetch(`https://api.github.com/repos/${name}/zipball`, requestInit).then(({ body }) => {
        if (!body) {
          throw new Error('No body!')
        }
        return { name, body }
      })
    ),
  )

  await writeZips('github', path, data)
}
