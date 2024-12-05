import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { UpdateOrgUseCase } from '../org/update-org-use-case'

export const makeUpdateOrgUseCase = (): UpdateOrgUseCase => {
  const orgsRepository = new PrismaOrgsRepository()
  const updateOrgUseCase = new UpdateOrgUseCase(orgsRepository)

  return updateOrgUseCase
}
