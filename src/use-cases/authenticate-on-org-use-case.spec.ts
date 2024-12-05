import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateOnOrgUseCase } from './authenticate-on-org-use-case'
import { hash } from 'bcrypt'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOnOrgUseCase

describe('Authenticate on service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOnOrgUseCase(orgsRepository)
  })

  it('should be able to authenticate with an valid email and password', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'
    const representant_name = 'John Doe'

    await orgsRepository.create({
      representant_name,
      address: 'Wall Street, 51',
      cep: '99999999',
      phone: '5542999999999',
      email,
      password_hash: await hash(password, 6),
    })

    const { org } = await sut.execute({
      email,
      password,
    })

    expect(org).toEqual(
      expect.objectContaining({
        representant_name,
        email,
      }),
    )
  })

  it('should not be able to authenticate with an invalid email', async () => {
    const invalid_email = 'johndoe@example.com'
    const password = '123456'

    await expect(() =>
      sut.execute({
        email: invalid_email,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with an invalid password', async () => {
    const email = 'johndoe@example.com'
    const wrong_password = '654321'
    const representant_name = 'John Doe'

    await orgsRepository.create({
      representant_name,
      address: 'Wall Street, 51',
      cep: '99999999',
      phone: '5542999999999',
      email,
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email,
        password: wrong_password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
