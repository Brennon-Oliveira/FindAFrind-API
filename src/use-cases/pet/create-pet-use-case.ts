import { AdoptRequerimentsRepository } from '@/repositories/adopt-requeriments-repository'
import { PetPhotosRepository } from '@/repositories/pet-photos-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet, PetEnvironment, PetSize, Prisma } from '@prisma/client'
import { isValidPetAge } from '../business-rules/pet/is-valid-pet-age'
import { InvalidPetAgeError } from '../errors/pet-errors/invalid-pet-age-error'
import { isValidPetEnergyLevel } from '../business-rules/pet/is-valid-pet-energy-level'
import { InvalidPetEnergyLevelError } from '../errors/pet-errors/invalid-pet-energy-level-error'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgNotFoundError } from '../errors/resource-not-found-errors/org-not-found-error'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: number
  orgId: string
  energyLevel: number
  environment: PetEnvironment
  size: PetSize
  adoptRequeriments: {
    create: Prisma.AdoptRequerimentCreateWithoutPetInput[]
  }
  petPhotos: {
    create: Prisma.PetPhotoCreateWithoutPetInput[]
  }
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private petPhotosRepository: PetPhotosRepository,
    private adoptRequerimentsRepository: AdoptRequerimentsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    energyLevel,
    environment,
    size,
    orgId,
    adoptRequeriments: adoptRequerimentsFromParams,
    petPhotos: petPhotosFromParams,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    if (!isValidPetAge(age)) {
      throw new InvalidPetAgeError(age)
    }

    if (!isValidPetEnergyLevel(energyLevel)) {
      throw new InvalidPetEnergyLevelError(energyLevel)
    }

    if (!(await this.orgsRepository.existsById(orgId))) {
      throw new OrgNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      energy_level: energyLevel,
      environment,
      size,
      org_id: orgId,
    })

    await this.petPhotosRepository.createMany(
      petPhotosFromParams.create.map((petPhoto) => ({
        pet_id: pet.id,
        url: petPhoto.url,
        id: petPhoto.id,
      })),
    )
    await this.adoptRequerimentsRepository.createMany(
      adoptRequerimentsFromParams.create.map((adoptRequeriments) => ({
        pet_id: pet.id,
        requeriment: adoptRequeriments.requeriment,
        id: adoptRequeriments.id,
      })),
    )
    return { pet }
  }
}
