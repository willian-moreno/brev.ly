export class PageNotFound extends Error {
  constructor(
    message: string = 'Página não encontrada',
    options?: ErrorOptions
  ) {
    super(message, options)

    this.name = 'PageNotFound'
  }
}
