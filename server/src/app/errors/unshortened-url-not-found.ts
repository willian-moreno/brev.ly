export class UnshortenedUrlNotFound extends Error {
  constructor() {
    super('Unshortened url not found')

    this.name = 'UnshortenedUrlNotFound'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
