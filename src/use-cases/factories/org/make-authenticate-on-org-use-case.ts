import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { AuthenticateOnOrgUseCase } from '../../org/authenticate-on-org-use-case'

export const makeAuthenticateOnOrgUseCase = (): AuthenticateOnOrgUseCase => {
  const orgsRepository = new PrismaOrgsRepository()
  const authenticateOnOrgUseCase = new AuthenticateOnOrgUseCase(orgsRepository)

  return authenticateOnOrgUseCase
}
