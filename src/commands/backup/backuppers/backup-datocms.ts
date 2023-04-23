import { render, StructuredTextDocument } from 'npm:datocms-structured-text-to-html-string@2.1.11'
import { writeFile } from '../utils/backuppers-functions.ts'

// The collection is paginated!

type Record = {
  id: string
  attributes: {
    content: StructuredTextDocument
    [key: string]: unknown
  }
}

export default async function backup(path: string): Promise<void> {
  const response = await fetch('https://site-api.datocms.com/items', {
    headers: {
      'Authorization': 'Bearer ' + Deno.env.get('DATOCMS_API_TOKEN')!,
      'Accept': 'application/json',
      'X-Api-Version': '3',
    },
  })

  const { data: records, meta: { total_count } }: { data: Record[]; meta: { total_count: number } } = await response.json()

  if (records.length !== total_count) {
    throw new Error('Missing records')
  }

  // deno-lint-ignore no-unused-vars
  const data = records.map(({ id, attributes: { updated_at, created_at, cover_image, ...attributes } }) => ({
    id,
    attributes: {
      ...attributes,
      content: render(attributes.content)?.replaceAll(/\n/g, '&#10;').replaceAll(/\"/g, ''),
    },
  }))

  await writeFile('datocms', path, data)
}
