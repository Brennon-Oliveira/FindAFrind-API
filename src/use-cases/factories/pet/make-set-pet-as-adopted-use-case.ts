import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SetPetAsAdoptedUseCase } from '@/use-cases/pet/set-pet-as-adopted-use-case'

export const makeSetPetAsAdoptedUseCase = (): SetPetAsAdoptedUseCase => {
  const petsRepository = new PrismaPetsRepository()
  const setPetAsAdoptedUseCase = new SetPetAsAdoptedUseCase(petsRepository)
  return setPetAsAdoptedUseCase
}
