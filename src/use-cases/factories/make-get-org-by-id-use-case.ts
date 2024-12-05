import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { GetOrgByIdUseCase } from '../org/get-org-by-id-use-case'

export const makeGetOrgByIdUseCase = (): GetOrgByIdUseCase => {
  const orgsRepository = new PrismaOrgsRepository()
  const createOrgUseCase = new GetOrgByIdUseCase(orgsRepository)

  return createOrgUseCase
}
