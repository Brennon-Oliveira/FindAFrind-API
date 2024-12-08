export class PetNotFoundError extends Error {
  constructor() {
    super('The pet must exist')
  }
}
