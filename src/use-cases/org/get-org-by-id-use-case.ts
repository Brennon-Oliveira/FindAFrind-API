import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { OrgNotFoundError } from '../errors/resource-not-found-errors/org-not-found-error'

interface GetOrgByIdUseCaseRequest {
  orgId: string
}

interface GetOrgByIdUseCaseResponse {
  org: Org
}

export class GetOrgByIdUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    orgId,
  }: GetOrgByIdUseCaseRequest): Promise<GetOrgByIdUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new OrgNotFoundError()
    }

    return { org }
  }
}
