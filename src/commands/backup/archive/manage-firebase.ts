import 'https://deno.land/std@0.181.0/dotenv/load.ts'
import { cert, initializeApp } from 'npm:firebase-admin/app'
import { getAuth } from 'npm:firebase-admin/auth'

initializeApp({
  credential: cert({
    projectId: Deno.env.get('FIREBASE_PROJECT_ID')!,
    clientEmail: Deno.env.get('FIREBASE_CLIENT_EMAIL')!,
    privateKey: Deno.env.get('FIREBASE_PRIVATE_KEY')!.replace(/\\n/g, '\n'),
  }),
})

const auth = getAuth()

console.log(await auth.listUsers())
