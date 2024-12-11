import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { Org, Pet, PetEnvironment, PetSize } from '@prisma/client'
import { GetPetByIdUseCase } from './get-pet-by-id-use-case'
import { PetNotFoundError } from '../errors/resource-not-found-errors/pet-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetByIdUseCase

let mainOrg: Org
let petBob: Pet

describe('Get Pets From City Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetByIdUseCase(petsRepository)

    mainOrg = await orgsRepository.create({
      representant_name: 'John Doe',
      email: 'johndoe@example.com',
      address: 'Wall Street, 51',
      cep: '99999999',
      city: 'New York',
      password_hash: 'my-passwword',
      phone: '5542999999999',
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
  })

  it('should be able to get a pet by id', async () => {
    const { pet } = await sut.execute({
      petId: petBob.id,
    })

    expect(pet).toEqual(
      expect.objectContaining({
        ...petBob,
      }),
    )
  })

  it('should not be able to get a pet with an invalid id', async () => {
    const invalidId = 'my-invalid-id'

    await expect(() =>
      sut.execute({
        petId: invalidId,
      }),
    ).rejects.toBeInstanceOf(PetNotFoundError)
  })
})
