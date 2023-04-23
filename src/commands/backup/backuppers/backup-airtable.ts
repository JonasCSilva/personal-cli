import { writeFile } from '../utils/backuppers-functions.ts'

type TableMetadata = { id: string; name: string }

type AirtableResponse = { tables: { id: string; name: string; [key: string]: unknown }[] }

type TableData = { records: { [key: string]: { [key: string]: string } }[] }

const URL = 'https://api.airtable.com/v0/'

const requestInit: RequestInit = { headers: { Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')!}` } }

const getTablesData = (tablesMetadatas: TableMetadata[], baseId: string): Promise<TableData[]> => {
  const tablesDataPromises: Promise<TableData>[] = []

  for (const { id } of tablesMetadatas) {
    const request = fetch(`${URL}${baseId}/${id}`, requestInit).then((res) => res.json())

    tablesDataPromises.push(request)
  }

  return Promise.all(tablesDataPromises)
}

export default async function backup(path: string, index: string): Promise<void> {
  const baseId = Deno.env.get(`AIRTABLE_BASE_ID_${index}`)!

  const response = await fetch(`${URL}meta/bases/${baseId}/tables`, requestInit)

  const { tables } = await response.json() as AirtableResponse

  const tablesMetadatas = tables.map(({ id, name }: TableMetadata) => ({ id, name }))

  const tablesData = await getTablesData(tablesMetadatas, baseId)

  const data = tablesMetadatas.map(({ name }, index) => ({
    name,
    content: tablesData[index].records.map(({ fields }) => fields),
  }))

  await writeFile(`airtable-${index}`, path, data)
}
