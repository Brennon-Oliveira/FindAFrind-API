export class InvalidPhoneError extends Error {
  constructor() {
    super('The phone needs to be valid')
  }
}
