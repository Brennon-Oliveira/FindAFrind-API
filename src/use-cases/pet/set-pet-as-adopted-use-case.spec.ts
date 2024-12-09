import { SetPetAsAdoptedUseCase } from './set-pet-as-adopted-use-case'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { Org, Pet, PetEnvironment, PetSize } from '@prisma/client'
import { PetIsNotFromOrgIdError } from '../errors/pet-errors/pet-is-not-from-org-error'
import { PetNotFoundError } from '../errors/resource-not-found-errors/pet-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: SetPetAsAdoptedUseCase

let createdOrg: Org
let createdPet: Pet

describe('Set pet as adopted Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new SetPetAsAdoptedUseCase(petsRepository, orgsRepository)

    createdOrg = await orgsRepository.create({
      representant_name: 'John Doe',
      email: 'johndoe@example.com',
      address: 'Wall Street, 51',
      cep: '99999999',
      password_hash: 'my-passwword',
      phone: '5542999999999',
    })

    createdPet = await petsRepository.create({
      name: 'Bob',
      about: 'Bob is a very lovely pet',
      age: 4,
      energy_level: 2,
      environment: PetEnvironment.BOTH,
      org_id: createdOrg.id,
      size: PetSize.MEDIUM,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check pet as adopted', async () => {
    vi.setSystemTime(new Date(2024, 12, 9, 10, 0, 0))
    const { pet } = await sut.execute({
      orgId: createdOrg.id,
      petId: createdPet.id,
    })

    const updatedPet = await petsRepository.findById(pet.id)

    expect(pet.adopted_at).toEqual(new Date(2024, 12, 9, 10, 0, 0))
    expect(updatedPet?.adopted_at).toEqual(new Date(2024, 12, 9, 10, 0, 0))
  })

  it('should not be able to check pet as adopted from another org', async () => {
    vi.setSystemTime(new Date(2024, 12, 9, 10, 0, 0))

    const anotherOrgId = 'my-wrong-id'

    await expect(() =>
      sut.execute({
        orgId: anotherOrgId,
        petId: createdPet.id,
      }),
    ).rejects.toBeInstanceOf(PetIsNotFromOrgIdError)
  })

  it('should not be able to check un invalid pet', async () => {
    vi.setSystemTime(new Date(2024, 12, 9, 10, 0, 0))

    const invalidPetId = 'my-pet-invalid'

    await expect(() =>
      sut.execute({
        orgId: createdOrg.id,
        petId: invalidPetId,
      }),
    ).rejects.toBeInstanceOf(PetNotFoundError)
  })
})
