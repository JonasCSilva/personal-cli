import { encode } from 'https://deno.land/std@0.93.0/encoding/base64.ts'
import { writeFile } from '../utils/backuppers-functions.ts'

type RawTracks = {
  added_at: string
  track: {
    name: string
    artists: { name: string }[]
    album: { name: string }
  }
}

export default async function backup(path: string): Promise<void> {
  const token = encode(Deno.env.get('SPOTIFY_CLIENT_ID')! + ':' + Deno.env.get('SPOTIFY_CLIENT_SECRET')!)

  const urlParams = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: Deno.env.get('SPOTIFY_REFRESH_TOKEN')!,
  })

  const requestConfig1: RequestInit = {
    method: 'POST',
    body: urlParams,
    headers: { Authorization: `Basic ${token}` },
  }

  const { access_token } = await fetch('https://accounts.spotify.com/api/token', requestConfig1).then((response) =>
    response.json()
  )

  const requestConfig2: RequestInit = { headers: { Authorization: `Bearer ${access_token}` } }

  const response2 = await fetch('https://api.spotify.com/v1/me/tracks?offset=0&limit=50', requestConfig2)

  const { total, items } = await response2.json()

  const totalRequests = Math.floor(total / 50)

  const requests: Promise<Response>[] = []

  for (let i = 1; i <= totalRequests; i++) {
    requests.push(fetch(`https://api.spotify.com/v1/me/tracks?offset=${50 * (i)}&limit=50`, requestConfig2))
  }

  const responses = await Promise.all(requests)

  let rawTracks = items

  for (const response of responses) {
    const { items } = await response.json()
    rawTracks = rawTracks.concat(items)
  }

  const data = rawTracks.map(
    ({
      added_at,
      track: {
        name,
        artists,
        album: { name: album_name },
      },
    }: RawTracks) => ({
      added_at,
      name,
      album_name,
      artists: artists.map(({ name }: { name: string }) => name),
    }),
  )

  await writeFile('spotify', path, data)
}
