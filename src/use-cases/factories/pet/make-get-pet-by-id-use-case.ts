import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetByIdUseCase } from '@/use-cases/pet/get-pet-by-id-use-case'

export const makeGetPetByIdUseCase = (): GetPetByIdUseCase => {
  const petsRepository = new PrismaPetsRepository()

  const getPetByIdUseCase = new GetPetByIdUseCase(petsRepository)
  return getPetByIdUseCase
}
