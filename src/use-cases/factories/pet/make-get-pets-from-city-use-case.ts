import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetsFromCityUseCase } from '@/use-cases/pet/get-pets-from-city-use-case'

export const makeGetPetsFromCityUseCase = (): GetPetsFromCityUseCase => {
  const petsRepository = new PrismaPetsRepository()

  const getPetsFromOrgUseCase = new GetPetsFromCityUseCase(petsRepository)
  return getPetsFromOrgUseCase
}
