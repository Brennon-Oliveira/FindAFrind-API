import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { PetNotFoundError } from '../errors/resource-not-found-errors/pet-not-found-error'

interface GetPetByIdUseCaseRequest {
  petId: string
}

interface GetPetByIdUseCaseResponse {
  pet: Pet
}

export class GetPetByIdUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetPetByIdUseCaseRequest): Promise<GetPetByIdUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new PetNotFoundError()
    }

    return { pet }
  }
}
