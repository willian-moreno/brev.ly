export class ShortenedUrlAlreadyExists extends Error {
  constructor() {
    super('Shortened url already exists')

    this.name = 'ShortenedUrlAlreadyExists'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
