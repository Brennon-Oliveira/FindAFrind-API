import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetsFromCityUseCase } from './get-pets-from-city-use-case'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { Org, Pet, PetEnvironment, PetSize } from '@prisma/client'
import { InvalidPaginationPageError } from '../errors/pagination/invalid-pagination-page-error'
import { MIN_PAGINATION_PAGE } from '../business-rules/pet/is-valid-pagination-page'
import {
  MAX_PAGINATION_SIZE,
  MIN_PAGINATION_SIZE,
} from '../business-rules/pet/is-valid-pagination-size'
import { InvalidPaginationSizeError } from '../errors/pagination/invalid-pagination-size-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetsFromCityUseCase

let mainOrg: Org, anotherOrg: Org, anotherCityOrg: Org, emptyOrg: Org
let petBob: Pet, petAlfred: Pet, petCall: Pet

describe('Get Pets From City Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetsFromCityUseCase(petsRepository)

    mainOrg = await orgsRepository.create({
      representant_name: 'John Doe',
      email: 'johndoe@example.com',
      address: 'Wall Street, 51',
      cep: '99999999',
      city: 'New York',
      password_hash: 'my-passwword',
      phone: '5542999999999',
    })

    anotherOrg = await orgsRepository.create({
      representant_name: 'Arthur Logan',
      email: 'arthurlogan@example.com',
      address: 'Wall Street, 52',
      cep: '99999991',
      city: 'New York',
      password_hash: 'my-passwword',
      phone: '5542999999991',
    })

    anotherCityOrg = await orgsRepository.create({
      representant_name: 'Empty Org',
      email: 'emptyorg@example.com',
      address: 'Wall Street, 52',
      cep: '99999991',
      city: 'Detroid',
      password_hash: 'my-passwword',
      phone: '5542999999991',
    })

    emptyOrg = await orgsRepository.create({
      representant_name: 'Empty Org',
      email: 'emptyorg@example.com',
      address: 'Wall Street, 52',
      cep: '99999991',
      city: 'Denver',
      password_hash: 'my-passwword',
      phone: '5542999999991',
    })

    petBob = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a very lovely pet',
      age: 4,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      org_id: mainOrg.id,
      size: PetSize.MEDIUM,
    })

    petAlfred = await petsRepository.create({
      name: 'Alfred',
      about: 'Alfred is another lovely pet',
      age: 2,
      energy_level: 1,
      environment: PetEnvironment.CLOSE,
      org_id: mainOrg.id,
      size: PetSize.MEDIUM,
    })

    petCall = await petsRepository.create({
      name: 'Call',
      about: 'Call is one more lovely pet',
      age: 7,
      energy_level: 4,
      environment: PetEnvironment.OPEN,
      org_id: anotherOrg.id,
      size: PetSize.SMALL,
    })

    await petsRepository.create({
      name: 'Junior',
      about: 'Junior is one more lovely pet',
      age: 7,
      energy_level: 4,
      environment: PetEnvironment.OPEN,
      org_id: anotherCityOrg.id,
      size: PetSize.SMALL,
    })
  })

  it('should be able to get all pets from a city paginated', async () => {
    const { pets } = await sut.execute({
      city: mainOrg.city,
    })

    expect(pets).toHaveLength(3)
    expect(pets).toContainEqual(expect.objectContaining(petBob))
    expect(pets).toContainEqual(expect.objectContaining(petAlfred))
    expect(pets).toContainEqual(expect.objectContaining(petCall))
  })

  it('should be able to return an empty list if not has pet in this city', async () => {
    const { pets } = await sut.execute({
      city: emptyOrg.city,
    })

    expect(pets).toHaveLength(0)
  })

  it('should not be able to return with an invalid page', async () => {
    await expect(() =>
      sut.execute({
        city: mainOrg.city,
        page: MIN_PAGINATION_PAGE - 1,
      }),
    ).rejects.toBeInstanceOf(InvalidPaginationPageError)
  })

  it('should not be able to return with an invalid page size (lower)', async () => {
    await expect(() =>
      sut.execute({
        city: mainOrg.city,
        pageSize: MIN_PAGINATION_SIZE - 1,
      }),
    ).rejects.toBeInstanceOf(InvalidPaginationSizeError)
  })

  it('should not be able to return with an invalid page size (lower)', async () => {
    await expect(() =>
      sut.execute({
        city: mainOrg.city,
        pageSize: MAX_PAGINATION_SIZE + 1,
      }),
    ).rejects.toBeInstanceOf(InvalidPaginationSizeError)
  })

  it('should be able to return result paginated', async () => {
    for (let petIndex = 0; petIndex < 120; petIndex++) {
      await petsRepository.create({
        name: `Pet ${petIndex}`,
        about: 'Pet is a very lovely pet',
        age: 4,
        energy_level: 2,
        environment: PetEnvironment.BOTH,
        org_id: mainOrg.id,
        size: PetSize.MEDIUM,
      })
    }
    const { pets } = await sut.execute({
      city: mainOrg.city,
      page: 2,
      pageSize: 25,
    })

    expect(pets).toHaveLength(25)
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: 'Pet 22',
      }),
    )
  })
})
