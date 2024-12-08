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
import { PetNotFoundError } from '../errors/resource-not-found-errors/pet-not-found-error'
import { AdoptRequerimentNotFoundError } from '../errors/resource-not-found-errors/adopt-requeriment-not-found-error'
import { PetPhotoNotFoundError } from '../errors/resource-not-found-errors/pet-photo-not-found-error'
import { isValidPetAge } from '../business-rules/pet/is-valid-pet-age'
import { InvalidPetAgeError } from '../errors/pet-errors/invalid-pet-age-error'
import { isValidPetEnergyLevel } from '../business-rules/pet/is-valid-pet-energy-level'
import { InvalidPetEnergyLevelError } from '../errors/pet-errors/invalid-pet-energy-level-error'

interface UpdatePetUseCaseRequest {
  id: string
  name: string
  about: string
  age: number
  energyLevel: number
  environment: PetEnvironment
  size: PetSize
  adoptRequeriments: {
    create: Prisma.AdoptRequerimentUncheckedCreateInput[]
    delete: string[]
  }
  petPhotos: {
    create: Prisma.PetPhotoUncheckedCreateInput[]
    delete: string[]
  }
}

interface UpdatePetUseCaseResponse {
  pet: Pet
  adoptRequeriments: AdoptRequeriment[]
  petPhotos: PetPhoto[]
}

export class UpdatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private petPhotosRepository: PetPhotosRepository,
    private adoptRequerimentsRepository: AdoptRequerimentsRepository,
  ) {}

  async execute({
    id,
    name,
    about,
    age,
    energyLevel,
    environment,
    size,
    adoptRequeriments: adoptRequerimentsFromParams,
    petPhotos: petPhotosFromParams,
  }: UpdatePetUseCaseRequest): Promise<UpdatePetUseCaseResponse> {
    const petToUpdate = await this.petsRepository.findById(id)

    if (!petToUpdate) {
      throw new PetNotFoundError()
    }

    if (
      !(await this.adoptRequerimentsRepository.allExists(
        adoptRequerimentsFromParams.delete,
      ))
    ) {
      throw new AdoptRequerimentNotFoundError()
    }

    if (
      !(await this.petPhotosRepository.allExists(petPhotosFromParams.delete))
    ) {
      throw new PetPhotoNotFoundError()
    }

    if (!isValidPetAge(age)) {
      throw new InvalidPetAgeError(age)
    }

    if (!isValidPetEnergyLevel(energyLevel)) {
      throw new InvalidPetEnergyLevelError(energyLevel)
    }

    const pet = await this.petsRepository.save({
      ...petToUpdate,
      name,
      about,
      age,
      energy_level: energyLevel,
      environment,
      size,
    })

    await this.adoptRequerimentsRepository.deleteMany(
      adoptRequerimentsFromParams.delete,
    )
    await this.petPhotosRepository.deleteMany(petPhotosFromParams.delete)

    const adoptRequeriments = await this.adoptRequerimentsRepository.createMany(
      adoptRequerimentsFromParams.create.map((adoptRequeriment) => ({
        ...adoptRequeriment,
        pet_id: pet.id,
      })),
    )

    const petPhotos = await this.petPhotosRepository.createMany(
      petPhotosFromParams.create.map((petPhoto) => ({
        ...petPhoto,
        pet_id: pet.id,
      })),
    )

    return { pet, adoptRequeriments, petPhotos }
  }
}
