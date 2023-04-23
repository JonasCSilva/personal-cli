import { writeFile } from '../utils/backuppers-functions.ts'

type Task = {
  repeat: unknown
  frequency: unknown
  everyX: unknown
  type: unknown
  notes: unknown
  priority: unknown
  checklist: unknown
  text: unknown
}

type RawTask = Task & {
  [key: string]: string
}

export default async function backup(path: string): Promise<void> {
  const requestConfig: RequestInit = {
    headers: { 'x-api-user': Deno.env.get('HABITICA_USER')!, 'x-api-key': Deno.env.get('HABITICA_KEY')! },
  }

  const result = await fetch('https://habitica.com/api/v3/tasks/user', requestConfig).then((response) => response.json())

  if (!result.success) {
    throw new Error('Request failed!')
  }

  const data = result.data.map((task: RawTask): Task => {
    const { repeat, frequency, everyX, type, notes, priority, checklist, text } = task

    return ({ repeat, frequency, everyX, type, notes, priority, checklist, text })
  })

  await writeFile('habitica', path, data)
}
