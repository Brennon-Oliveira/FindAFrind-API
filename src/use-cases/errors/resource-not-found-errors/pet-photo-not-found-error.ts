export class PetPhotoNotFoundError extends Error {
  constructor() {
    super('The pet photo must exist')
  }
}
