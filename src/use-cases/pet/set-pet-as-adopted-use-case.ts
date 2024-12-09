import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { PetNotFoundError } from '../errors/resource-not-found-errors/pet-not-found-error'
import { PetIsNotFromOrgIdError } from '../errors/pet-errors/pet-is-not-from-org-error'

interface SetPetAsAdoptedUseCaseRequest {
  petId: string
  orgId: string
}

interface SetPetAsAdoptedUseCaseResponse {
  pet: Pet
}

export class SetPetAsAdoptedUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    petId,
    orgId,
  }: SetPetAsAdoptedUseCaseRequest): Promise<SetPetAsAdoptedUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new PetNotFoundError()
    }

    if (orgId !== pet.org_id) {
      throw new PetIsNotFromOrgIdError()
    }

    pet.adopted_at = new Date()

    this.petsRepository.save(pet)

    return { pet }
  }
}
