import 'https://deno.land/std@0.181.0/dotenv/load.ts'
import { cert, initializeApp } from 'npm:firebase-admin/app'
import { CollectionReference, DocumentData, getFirestore } from 'npm:firebase-admin/firestore'

type Document = {
  id: string
  data: { [key: string]: DocumentData }
  collections: Collection[]
}

type Collection = {
  id: string
  documents: Document[]
}

type Data = { collections: Collection[] }

initializeApp({
  credential: cert({
    projectId: Deno.env.get('FIREBASE_PROJECT_ID')!,
    clientEmail: Deno.env.get('FIREBASE_CLIENT_EMAIL')!,
    privateKey: Deno.env.get('FIREBASE_PRIVATE_KEY')!.replace(/\\n/g, '\n'),
  }),
})

const getCollections = (collectionsReferences: CollectionReference<DocumentData>[]): Promise<Collection[]> =>
  Promise.all(
    collectionsReferences.map(async (collectionReference) => ({
      id: collectionReference.id,
      documents: await getDocuments(collectionReference.path),
    })),
  )

const getDocuments = async (collectionPath: string): Promise<Document[]> => {
  const { docs } = await firestore.collection(collectionPath).get()

  const documents: Document[] = []

  for (const documentReference of docs) {
    const collectionsReferences = await firestore.collection(collectionPath).doc(documentReference.id).listCollections()

    const collections = await getCollections(collectionsReferences)

    documents.push({ id: documentReference.id, data: documentReference.data(), collections })
  }

  return documents
}

const firestore = getFirestore()

const collectionsReferences = await firestore.listCollections()

const data: Data = {
  collections: await getCollections(collectionsReferences),
}

await Deno.writeTextFile('./firebase.json', JSON.stringify(data, undefined, 2))
