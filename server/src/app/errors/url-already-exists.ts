export class UrlAlreadyExists extends Error {
  constructor() {
    super('URL already exists')

    this.name = 'UrlAlreadyExists'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
