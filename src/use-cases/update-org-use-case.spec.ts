import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { UpdateOrgUseCase } from './update-org-use-case'
import { randomUUID } from 'crypto'
import { InvalidPhoneError } from './errors/invalid-data-errors/invalid-phone-error'
import { InvalidCepError } from './errors/invalid-data-errors/invalid-cep-error'
import { OrgNotFoundError } from './errors/resource-not-found-errors/org-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let updateOrgUseCase: UpdateOrgUseCase

describe('Update ORG Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    updateOrgUseCase = new UpdateOrgUseCase(orgsRepository)
  })

  it('should to be able to update an org', async () => {
    const representant_name = 'John Doe new'
    const address = 'Wall Street, 51 new'
    const cep = '99999991'
    const phone = '5542999999991'
    const id = randomUUID()

    orgsRepository.create({
      id,
      representant_name: 'John Doe',
      address: 'Wall Street, 51',
      cep: '99999999',
      phone: '5542999999999',
      email: 'org@example.com',
      password_hash: 'my-example-password-hash',
    })

    const { org } = await updateOrgUseCase.execute({
      id,
      representant_name,
      address,
      cep,
      phone,
    })

    expect(org).toEqual(
      expect.objectContaining({
        representant_name,
        address,
        cep,
        phone,
      }),
    )
  })

  it('should not be able to update by an unexistent org id', async () => {
    const unexistentOrgId = randomUUID()

    await expect(() =>
      updateOrgUseCase.execute({
        id: unexistentOrgId,
        representant_name: 'John Doe',
        address: "'Wall Street, 51'",
        cep: '99999999',
        phone: '5542999999999',
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })

  it('should not be able to update an org with a invalid cep', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const invalid_cep = '99999'
    const phone = '5542999999999'
    const id = randomUUID()

    await orgsRepository.create({
      id,
      representant_name,
      address,
      cep: '99999999',
      email: 'johndue@example.com',
      phone,
      password_hash: 'my-password-hash',
    })

    await expect(() =>
      updateOrgUseCase.execute({
        id,
        representant_name,
        address,
        cep: invalid_cep,
        phone,
      }),
    ).rejects.toBeInstanceOf(InvalidCepError)
  })

  it('should not be able to update an org with a invalid phone', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const cep = '99999999'
    const invalid_phone = '55429999999aa'
    const id = randomUUID()

    await orgsRepository.create({
      id,
      representant_name,
      address,
      cep,
      email: 'johndue@example.com',
      phone: '5542999999999',
      password_hash: 'my-password-hash',
    })

    await expect(() =>
      updateOrgUseCase.execute({
        id,
        representant_name,
        address,
        cep,
        phone: invalid_phone,
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneError)
  })
})
