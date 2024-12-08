import { AdoptRequerimentsRepository } from '@/repositories/adopt-requeriments-repository'
import { PetPhotosRepository } from '@/repositories/pet-photos-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import {
  AdoptRequeriment,
  Pet,
  PetEnvironment,
  PetPhoto,
  PetSize,
  Prisma,
} from '@prisma/client'
import { isValidPetAge } from '../business-rules/pet/is-valid-pet-age'
import { InvalidPetAgeError } from '../errors/pet-errors/invalid-pet-age-error'
import { isValidPetEnergyLevel } from '../business-rules/pet/is-valid-pet-energy-level'
import { InvalidPetEnergyLevelError } from '../errors/pet-errors/invalid-pet-energy-level-error'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: number
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
  petPhotos: PetPhoto[]
  adoptRequeriments: AdoptRequeriment[]
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private petPhotosRepository: PetPhotosRepository,
    private adoptRequerimentsRepository: AdoptRequerimentsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    energyLevel,
    environment,
    size,
    adoptRequeriments: adoptRequerimentsFromParams,
    petPhotos: petPhotosFromParams,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    if (!isValidPetAge(age)) {
      throw new InvalidPetAgeError(age)
    }

    if (!isValidPetEnergyLevel(energyLevel)) {
      throw new InvalidPetEnergyLevelError(energyLevel)
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      energy_level: energyLevel,
      environment,
      size,
    })

    const petPhotos = await this.petPhotosRepository.createMany(
      petPhotosFromParams.create.map((petPhoto) => ({
        pet_id: pet.id,
        url: petPhoto.url,
        id: petPhoto.id,
      })),
    )
    const adoptRequeriments = await this.adoptRequerimentsRepository.createMany(
      adoptRequerimentsFromParams.create.map((adoptRequeriments) => ({
        pet_id: pet.id,
        requeriment: adoptRequeriments.requeriment,
        id: adoptRequeriments.id,
      })),
    )
    return { pet, petPhotos, adoptRequeriments }
  }
}
