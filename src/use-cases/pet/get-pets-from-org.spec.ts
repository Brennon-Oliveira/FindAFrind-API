import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { Org, Pet, PetEnvironment, PetSize } from '@prisma/client'
import { GetPetsFromOrgUseCase } from './get-pets-from-org'
import { OrgNotFoundError } from '../errors/resource-not-found-errors/org-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: GetPetsFromOrgUseCase

let mainOrg: Org, anotherOrg: Org, emptyOrg: Org
let petBob: Pet, petAlfred: Pet

describe('Set pet as adopted Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetsFromOrgUseCase(petsRepository, orgsRepository)

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

    emptyOrg = await orgsRepository.create({
      representant_name: 'Empty Org',
      email: 'emptyorg@example.com',
      address: 'Wall Street, 52',
      cep: '99999991',
      city: 'New York',
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

    await petsRepository.create({
      name: 'Call',
      about: 'Call is one more lovely pet',
      age: 7,
      energy_level: 4,
      environment: PetEnvironment.OPEN,
      org_id: anotherOrg.id,
      size: PetSize.SMALL,
    })
  })

  it('should be able get all pets from org', async () => {
    const { pets } = await sut.execute({
      orgId: mainOrg.id,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({
        ...petBob,
      }),
      expect.objectContaining({
        ...petAlfred,
      }),
    ])
  })

  it('should be able to return an empty array if org has no pets', async () => {
    const { pets } = await sut.execute({
      orgId: emptyOrg.id,
    })

    expect(pets).toHaveLength(0)
  })

  it('should not be able get all pets from an invalid org', async () => {
    const invalidOrgId = 'invalid-org-id'

    await expect(() =>
      sut.execute({
        orgId: invalidOrgId,
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })
})
