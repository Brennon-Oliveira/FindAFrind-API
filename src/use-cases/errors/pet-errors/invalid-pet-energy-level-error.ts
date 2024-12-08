export class InvalidPetEnergyLevelError extends Error {
  constructor(invalidEnergyLevel: number) {
    super(`${invalidEnergyLevel} isn't a valid energy level`)
  }
}
