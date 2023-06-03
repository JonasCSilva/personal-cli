export type Config = {
  b: {
    env?: { [key: string]: string }
    ignore: string[]
  }
  cf: {
    ignore: {
      files: string[]
      paths: (string | string[])[]
    }
  }
}
