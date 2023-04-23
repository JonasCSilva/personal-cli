export type Config = {
  cf: {
    ignore: {
      files: string[]
      paths: (string | string[])[]
    }
  }
}
