import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SetPetAsAdoptedUseCase } from '@/use-cases/pet/set-pet-as-adopted-use-case'

export const makeSetPetAsAdoptedUseCase = (): SetPetAsAdoptedUseCase => {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const setPetAsAdoptedUseCase = new SetPetAsAdoptedUseCase(
    petsRepository,
    orgsRepository,
  )
  return setPetAsAdoptedUseCase
}
