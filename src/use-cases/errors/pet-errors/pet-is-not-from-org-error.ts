export class PetIsNotFromOrgIdError extends Error {
  constructor() {
    super('The pet is not from your org')
  }
}
