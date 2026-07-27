export class FailureToUploadToStorage extends Error {
  constructor() {
    super('Failure to upload to storage')

    this.name = 'FailureToUploadToStorage'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
