import 'dotenv/load.ts'
import { Application, Router } from 'oak'
import { encode } from 'encoding/base64.ts'

const CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!
const CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')!
const REDIRECT_URI = 'http://localhost:8080/callback'

const SCOPES = [
  'playlist-read-private',
  'user-library-read',
].join(' ')

const url = 'https://accounts.spotify.com/authorize?response_type=code' +
  `&client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

const app = new Application()
const router = new Router()

router
  .get('/callback', async (ctx) => {
    const code = ctx.request.url.searchParams.get('code')

    if (!code) {
      console.log(`No code provided`)
      ctx.response.body = `${ctx.request.body}`
      return
    }

    const token = encode(`${CLIENT_ID}:${CLIENT_SECRET}`)

    const urlParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    })

    const data = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        body: urlParams,
        headers: {
          'Authorization': `Basic ${token}`,
        },
      },
    )

    const { access_token, refresh_token } = await data.json()

    console.log(
      `ACCESS TOKEN: ${access_token}\n\n` +
        `REFRESH TOKEN: ${refresh_token}\n\n`,
    )

    ctx.response.body = `You can close this window now.`
  })

app.use(router.routes())

app.addEventListener('listen', () => {
  console.log(`To get OAuth tokens, navigate to:\n${url}`)
})

await app.listen({ port: 8080 })
