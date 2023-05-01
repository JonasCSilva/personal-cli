export type Config = {
  b: {
    ignore: string[]
  },
  cf: {
    ignore: {
      files: string[]
      paths: (string | string[])[]
    }
  }
}
