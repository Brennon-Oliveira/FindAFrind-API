import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrgUseCase } from './create-org-use-case'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { compare } from 'bcrypt'
import { DuplicatedEmailError } from './errors/duplicated-email-error'
import { InvalidCepError } from './errors/invalid-data-errors/invalid-cep-error'
import { InvalidPhoneError } from './errors/invalid-data-errors/invalid-phone-error'
import { InvalidEmailError } from './errors/invalid-data-errors/invalid-email-error'

let orgsRepository: InMemoryOrgsRepository
let createOrgUseCase: CreateOrgUseCase

describe('Create ORG Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    createOrgUseCase = new CreateOrgUseCase(orgsRepository)
  })

  it('should to be able to create an org', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const cep = '99999999'
    const email = 'johndue@example.com'
    const phone = '5542999999999'

    const { org } = await createOrgUseCase.execute({
      representant_name,
      address,
      cep,
      email,
      phone,
      password: '123456',
    })

    expect(org).toEqual(
      expect.objectContaining({
        representant_name,
        address,
        cep,
        email,
        phone,
      }),
    )
  })

  it('should be able to encrypt the password', async () => {
    const password = '123456'

    const { org } = await createOrgUseCase.execute({
      representant_name: 'John Doe',
      address: 'Wall Street, 51',
      cep: '99999999',
      email: 'johndue@example.com',
      phone: '5542999999999',
      password,
    })

    await expect(compare(password, org.password_hash)).resolves.toEqual(true)
  })

  it('should not be able to create an org with a duplicated email', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const cep = '99999999'
    const email = 'johndue@example.com'
    const phone = '5542999999999'

    await createOrgUseCase.execute({
      representant_name,
      address,
      cep,
      email,
      phone,
      password: '123456',
    })

    await expect(() =>
      createOrgUseCase.execute({
        representant_name,
        address,
        cep,
        email,
        phone,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(DuplicatedEmailError)
  })

  it('should not be able to create an org with a invalid cep', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const invalid_cep = '99999'
    const email = 'johndue@example.com'
    const phone = '5542999999999'

    await expect(() =>
      createOrgUseCase.execute({
        representant_name,
        address,
        cep: invalid_cep,
        email,
        phone,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCepError)
  })

  it('should not be able to create an org with a invalid cep', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const cep = '99999999'
    const email = 'johndue@example.com'
    const invalid_phone = '55429999999'

    await expect(() =>
      createOrgUseCase.execute({
        representant_name,
        address,
        cep,
        email,
        phone: invalid_phone,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidPhoneError)
  })

  it('should not be able to create an org with a invalid email', async () => {
    const representant_name = 'John Doe'
    const address = 'Wall Street, 51'
    const cep = '99999999'
    const invalid_email = 'johndueexample.com'
    const phone = '5542999999999'

    await expect(() =>
      createOrgUseCase.execute({
        representant_name,
        address,
        cep,
        phone,
        email: invalid_email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidEmailError)
  })
})
