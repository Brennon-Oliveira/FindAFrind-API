export class InvalidEmailError extends Error {
  constructor() {
    super('The email needs to be valid')
  }
}
