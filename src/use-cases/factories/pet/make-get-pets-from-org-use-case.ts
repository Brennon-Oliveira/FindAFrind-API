import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetsFromOrgUseCase } from '@/use-cases/pet/get-pets-from-org'

export const makeGetPetsFromOrgUseCase = (): GetPetsFromOrgUseCase => {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()

  const getPetsFromOrgUseCase = new GetPetsFromOrgUseCase(
    petsRepository,
    orgsRepository,
  )
  return getPetsFromOrgUseCase
}
