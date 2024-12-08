export class InvalidPetAgeError extends Error {
  constructor(invalidAge: number) {
    super(`${invalidAge} isn't a valid age for a pet`)
  }
}
