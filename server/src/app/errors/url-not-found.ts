export class UrlNotFound extends Error {
  constructor() {
    super('URL not found')

    this.name = 'UrlNotFound'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
