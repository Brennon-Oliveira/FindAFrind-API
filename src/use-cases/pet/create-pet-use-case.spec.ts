import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { CreatePetUseCase } from './create-pet-use-case'
import { beforeEach, describe, expect, it } from 'vitest'
import { Org, PetEnvironment, PetSize, Prisma } from '@prisma/client'
import { InMemoryPetPhotosRepository } from '@/repositories/in-memory/in-memory-pet-photos-repository'
import { InMemoryAdoptRequerimentsRepository } from '@/repositories/in-memory/in-memory-adopt-requeriments-repository'
import { InvalidPetAgeError } from '../errors/pet-errors/invalid-pet-age-error'
import {
  MAX_PET_ENERGY_LEVEL,
  MIN_PET_ENERGY_LEVEL,
} from '../business-rules/pet/is-valid-pet-energy-level'
import { InvalidPetEnergyLevelError } from '../errors/pet-errors/invalid-pet-energy-level-error'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { randomUUID } from 'crypto'
import { OrgNotFoundError } from '../errors/resource-not-found-errors/org-not-found-error'

let petsRepository: InMemoryPetsRepository
let petPhotosRepository: InMemoryPetPhotosRepository
let adoptRequerimentsRepository: InMemoryAdoptRequerimentsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase
let org: Org

describe('Create Pet Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    petPhotosRepository = new InMemoryPetPhotosRepository()
    adoptRequerimentsRepository = new InMemoryAdoptRequerimentsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(
      petsRepository,
      petPhotosRepository,
      adoptRequerimentsRepository,
      orgsRepository,
    )

    org = await orgsRepository.create({
      representant_name: 'John Doe',
      address: 'Wall Street, 51',
      cep: '99999999',
      email: 'johndue@example.com',
      phone: '5542999999999',
      password_hash: 'my-password-hash',
    })
  })

  it('should be able to create an pet', async () => {
    const name = 'My Pet'
    const about = 'about my pet'
    const photosToCreate: Prisma.PetPhotoCreateWithoutPetInput[] = [
      {
        url: 'image.png',
      },
      {
        url: 'another-image.png',
      },
    ]
    const adoptRequerimentsToCreate: Prisma.AdoptRequerimentCreateWithoutPetInput[] =
      [
        {
          requeriment: 'To be lovely',
        },
        {
          requeriment: 'Have free time',
        },
      ]

    const { pet } = await sut.execute({
      name,
      about,
      age: 3,
      energyLevel: 2,
      orgId: org.id,
      environment: PetEnvironment.BOTH,
      size: PetSize.MEDIUM,
      adoptRequeriments: {
        create: adoptRequerimentsToCreate,
      },
      petPhotos: {
        create: photosToCreate,
      },
    })

    expect(pet).toEqual(
      expect.objectContaining({
        name,
        about,
      }),
    )
    expect(petsRepository.items[0]).toEqual(
      expect.objectContaining({
        name,
        about,
      }),
    )

    const photos = await petPhotosRepository.getManyByPetId(pet.id)
    const adoptRequeriments = await adoptRequerimentsRepository.getManyByPetId(
      pet.id,
    )

    expect(photos).length(2)
    expect(photos).toEqual([
      expect.objectContaining(photosToCreate[0]),
      expect.objectContaining(photosToCreate[1]),
    ])
    expect(adoptRequeriments).length(2)
    expect(adoptRequeriments).toEqual([
      expect.objectContaining(adoptRequerimentsToCreate[0]),
      expect.objectContaining(adoptRequerimentsToCreate[1]),
    ])
  })

  it('shoud not be able to create with an invalid age', async () => {
    const invalidAge = -5

    await expect(() =>
      sut.execute({
        name: 'Bob',
        about: 'A very lovely dog',
        age: invalidAge,
        energyLevel: 2,
        orgId: org.id,
        environment: PetEnvironment.BOTH,
        size: PetSize.MEDIUM,
        adoptRequeriments: {
          create: [],
        },
        petPhotos: {
          create: [],
        },
      }),
    ).rejects.toBeInstanceOf(InvalidPetAgeError)
  })

  it('should not be able to create with an invalid energy level (lower)', async () => {
    const invalidEnergyLevel = MIN_PET_ENERGY_LEVEL - 1

    await expect(() =>
      sut.execute({
        name: 'Bob',
        about: 'A very lovely dog',
        age: 12,
        orgId: org.id,
        energyLevel: invalidEnergyLevel,
        environment: PetEnvironment.BOTH,
        size: PetSize.MEDIUM,
        adoptRequeriments: {
          create: [],
        },
        petPhotos: {
          create: [],
        },
      }),
    ).rejects.toBeInstanceOf(InvalidPetEnergyLevelError)
  })

  it('should not be able to create with an invalid energy level (higher)', async () => {
    const invalidEnergyLevel = MAX_PET_ENERGY_LEVEL + 1

    await expect(() =>
      sut.execute({
        name: 'Bob',
        about: 'A very lovely dog',
        age: 12,
        orgId: org.id,
        energyLevel: invalidEnergyLevel,
        environment: PetEnvironment.BOTH,
        size: PetSize.MEDIUM,
        adoptRequeriments: {
          create: [],
        },
        petPhotos: {
          create: [],
        },
      }),
    ).rejects.toBeInstanceOf(InvalidPetEnergyLevelError)
  })

  it('should not be able to create with an invalid org', async () => {
    const invalidOrgId = randomUUID()

    await expect(() =>
      sut.execute({
        name: 'Bob',
        about: 'A very lovely dog',
        age: 12,
        orgId: invalidOrgId,
        energyLevel: 2,
        environment: PetEnvironment.BOTH,
        size: PetSize.MEDIUM,
        adoptRequeriments: {
          create: [],
        },
        petPhotos: {
          create: [],
        },
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })
})
