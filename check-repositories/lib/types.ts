export type Fn = (repositoriesPath: string, dir: AsyncIterable<Deno.DirEntry>) => Promise<string[]>
