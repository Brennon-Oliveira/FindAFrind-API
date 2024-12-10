import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { OrgNotFoundError } from '../errors/resource-not-found-errors/org-not-found-error'

interface GetPetsFromOrgUseCaseRequest {
  orgId: string
}

interface GetPetsFromOrgUseCaseResponse {
  pets: Pet[]
}

export class GetPetsFromOrgUseCase {
  constructor(
    private petsRespository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    orgId,
  }: GetPetsFromOrgUseCaseRequest): Promise<GetPetsFromOrgUseCaseResponse> {
    const orgExists = await this.orgsRepository.existsById(orgId)

    if (!orgExists) {
      throw new OrgNotFoundError()
    }

    const pets = await this.petsRespository.getManyByOrgId(orgId)

    return { pets }
  }
}
