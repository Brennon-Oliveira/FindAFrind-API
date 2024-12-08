import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { CreateOrgUseCase } from '../../org/create-org-use-case'

export const makeCreateOrgUseCase = (): CreateOrgUseCase => {
  const orgsRepository = new PrismaOrgsRepository()
  const createOrgUseCase = new CreateOrgUseCase(orgsRepository)

  return createOrgUseCase
}
