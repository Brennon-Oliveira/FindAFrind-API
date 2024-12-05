export class InvalidCepError extends Error {
  constructor() {
    super('The CEP needs to be valid')
  }
}
