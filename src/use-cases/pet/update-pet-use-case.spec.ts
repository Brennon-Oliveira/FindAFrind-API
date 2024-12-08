import { InMemoryAdoptRequerimentsRepository } from '@/repositories/in-memory/in-memory-adopt-requeriments-repository'
import { InMemoryPetPhotosRepository } from '@/repositories/in-memory/in-memory-pet-photos-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { PetEnvironment, PetSize, Prisma } from '@prisma/client'
import { UpdatePetUseCase } from './update-pet-use-case'
import { PetNotFoundError } from '../errors/resource-not-found-errors/pet-not-found-error'
import { randomUUID } from 'crypto'
import { PetPhotoNotFoundError } from '../errors/resource-not-found-errors/pet-photo-not-found-error'
import { AdoptRequerimentNotFoundError } from '../errors/resource-not-found-errors/adopt-requeriment-not-found-error'
import { InvalidPetAgeError } from '../errors/pet-errors/invalid-pet-age-error'
import {
  MAX_PET_ENERGY_LEVEL,
  MIN_PET_ENERGY_LEVEL,
} from '../business-rules/pet/is-valid-pet-energy-level'
import { InvalidPetEnergyLevelError } from '../errors/pet-errors/invalid-pet-energy-level-error'

let petsRepository: InMemoryPetsRepository
let petPhotosRepository: InMemoryPetPhotosRepository
let adoptRequerimentsRepository: InMemoryAdoptRequerimentsRepository
let sut: UpdatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    petPhotosRepository = new InMemoryPetPhotosRepository()
    adoptRequerimentsRepository = new InMemoryAdoptRequerimentsRepository()
    sut = new UpdatePetUseCase(
      petsRepository,
      petPhotosRepository,
      adoptRequerimentsRepository,
    )
  })

  it('should be able to update a simple pet (whitout nested itens)', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    const name = 'New Bob'
    const about = 'My new about'
    const age = 5
    const energyLevel = 4
    const environment = PetEnvironment.CLOSE
    const size = PetSize.SMALL

    const {
      pet: { id },
    } = await sut.execute({
      id: createdId,
      name,
      about,
      age,
      energyLevel,
      environment,
      size,
      adoptRequeriments: {
        create: [],
        delete: [],
      },
      petPhotos: {
        create: [],
        delete: [],
      },
    })

    const createdPet = await petsRepository.findById(createdId)

    expect(createdPet).toEqual(
      expect.objectContaining({
        id,
        name,
        about,
        age,
        energy_level: energyLevel,
        environment,
        size,
      }),
    )
  })

  it('should be able to update a complex pet (with nested itens)', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    await adoptRequerimentsRepository.createMany([
      {
        pet_id: createdId,
        requeriment: 'My first requeriment to delete',
      },
      {
        pet_id: createdId,
        requeriment: 'My second requeriment to delete',
      },
    ])

    const [requeriment1, requeriment2] =
      await adoptRequerimentsRepository.getManyByPetId(createdId)

    await petPhotosRepository.createMany([
      {
        pet_id: createdId,
        url: 'My first photo to delete',
      },
      {
        pet_id: createdId,
        url: 'My second photo to delete',
      },
    ])

    const [photo1, photo2] = await petPhotosRepository.getManyByPetId(createdId)

    const name = 'New Bob'
    const about = 'My new about'
    const age = 5
    const energyLevel = 4
    const environment = PetEnvironment.CLOSE
    const size = PetSize.SMALL
    const adoptRequerimentsToCreate: Prisma.AdoptRequerimentUncheckedCreateInput[] =
      [
        {
          requeriment: 'My first requeriment',
          pet_id: createdId,
        },
        {
          requeriment: 'My second requeriment',
          pet_id: createdId,
        },
      ]
    const adoptRequerimentsToDelete: string[] = [
      requeriment1.id,
      requeriment2.id,
    ]
    const petPhotosToCreate: Prisma.PetPhotoUncheckedCreateInput[] = [
      {
        url: 'My first photo',
        pet_id: createdId,
      },
      {
        url: 'My second photo',
        pet_id: createdId,
      },
    ]
    const petPhotosToDelete: string[] = [photo1.id, photo2.id]

    const {
      pet: { id },
    } = await sut.execute({
      id: createdId,
      name,
      about,
      age,
      energyLevel,
      environment,
      size,
      adoptRequeriments: {
        create: adoptRequerimentsToCreate,
        delete: adoptRequerimentsToDelete,
      },
      petPhotos: {
        create: petPhotosToCreate,
        delete: petPhotosToDelete,
      },
    })

    const createdPet = await petsRepository.findById(createdId)
    const petPhotos = await petPhotosRepository.getManyByPetId(id)
    const adoptRequeriments =
      await adoptRequerimentsRepository.getManyByPetId(id)

    expect(createdPet).toEqual(
      expect.objectContaining({
        id,
        name,
        about,
        age,
        energy_level: energyLevel,
        environment,
        size,
      }),
    )

    expect(petPhotos).toHaveLength(2)
    expect(petPhotos).toEqual([
      ...petPhotosToCreate.map((petPhoto) =>
        expect.objectContaining({ url: petPhoto.url }),
      ),
    ])
    expect(adoptRequeriments).toHaveLength(2)
    expect(adoptRequeriments).toEqual([
      ...adoptRequerimentsToCreate.map((adoptRequeriment) =>
        expect.objectContaining({
          requeriment: adoptRequeriment.requeriment,
        }),
      ),
    ])
  })

  it('should not be able to delete an inexistent petPhoto', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    const invalidId = randomUUID()

    await expect(() =>
      sut.execute({
        id: createdId,
        name: 'Bob',
        about: "'Bob is a lovely pet'",
        age: 5,
        energyLevel: 3,
        environment: PetEnvironment.BOTH,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [],
          delete: [],
        },
        petPhotos: {
          create: [],
          delete: [invalidId],
        },
      }),
    ).rejects.toBeInstanceOf(PetPhotoNotFoundError)
  })

  it('should not be able to delete an inexistent adoptRequeriment', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    const invalidId = randomUUID()

    await expect(() =>
      sut.execute({
        id: createdId,
        name: 'Bob',
        about: "'Bob is a lovely pet'",
        age: 5,
        energyLevel: 3,
        environment: PetEnvironment.BOTH,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [],
          delete: [invalidId],
        },
        petPhotos: {
          create: [],
          delete: [],
        },
      }),
    ).rejects.toBeInstanceOf(AdoptRequerimentNotFoundError)
  })

  it('should not be able to update an inexistent pet', async () => {
    const invalidId = randomUUID()

    await expect(() =>
      sut.execute({
        id: invalidId,
        name: 'New Bob',
        about: 'My new about',
        age: 5,
        energyLevel: 4,
        environment: PetEnvironment.CLOSE,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [],
          delete: [],
        },
        petPhotos: {
          create: [],
          delete: [],
        },
      }),
    ).rejects.toBeInstanceOf(PetNotFoundError)
  })

  it('should not be able to update with an invalid age', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    const invalidAge = -5

    await expect(() =>
      sut.execute({
        id: createdId,
        name: 'Bob',
        about: "'Bob is a lovely pet'",
        age: invalidAge,
        energyLevel: 3,
        environment: PetEnvironment.BOTH,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [],
          delete: [],
        },
        petPhotos: {
          create: [],
          delete: [],
        },
      }),
    ).rejects.toBeInstanceOf(InvalidPetAgeError)
  })

  it('should not be able to create with an invalid energy level (lower)', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    const invalidEnergyLevel = MIN_PET_ENERGY_LEVEL - 1

    await expect(() =>
      sut.execute({
        id: createdId,
        name: 'Bob',
        about: "'Bob is a lovely pet'",
        age: 5,
        energyLevel: invalidEnergyLevel,
        environment: PetEnvironment.BOTH,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [],
          delete: [],
        },
        petPhotos: {
          create: [],
          delete: [],
        },
      }),
    ).rejects.toBeInstanceOf(InvalidPetEnergyLevelError)
  })

  it('should not be able to create with an invalid energy level (higher)', async () => {
    const { id: createdId } = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a lovely pet',
      age: 3,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
    })

    const invalidEnergyLevel = MAX_PET_ENERGY_LEVEL + 1

    await expect(() =>
      sut.execute({
        id: createdId,
        name: 'Bob',
        about: "'Bob is a lovely pet'",
        age: 5,
        energyLevel: invalidEnergyLevel,
        environment: PetEnvironment.BOTH,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [],
          delete: [],
        },
        petPhotos: {
          create: [],
          delete: [],
        },
      }),
    ).rejects.toBeInstanceOf(InvalidPetEnergyLevelError)
  })
})
