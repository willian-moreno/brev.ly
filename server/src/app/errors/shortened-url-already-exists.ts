export class ShortenedUrlAlreadyExists extends Error {
  constructor() {
    super('Shortened url already exists')
  }
}
