const home = Deno.env.get('USERPROFILE')!

const dir = Deno.readDir(home)

for await (const dirEntry of dir) {
  console.log(dirEntry.name)
}
