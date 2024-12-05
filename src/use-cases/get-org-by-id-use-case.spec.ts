import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcrypt'
import { GetOrgByIdUseCase } from './get-org-by-id-use-case'
import { randomUUID } from 'crypto'
import { OrgNotFoundError } from './errors/resource-not-found-errors/org-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let sut: GetOrgByIdUseCase

describe('Authenticate on service', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetOrgByIdUseCase(orgsRepository)
  })

  it('should be able to authenticate with an valid email and password', async () => {
    const email = 'johndoe@example.com'
    const password = '123456'
    const representant_name = 'John Doe'

    const { id } = await orgsRepository.create({
      representant_name,
      address: 'Wall Street, 51',
      cep: '99999999',
      phone: '5542999999999',
      email,
      password_hash: await hash(password, 6),
    })

    const { org } = await sut.execute({
      orgId: id,
    })

    expect(org).toEqual(
      expect.objectContaining({
        representant_name,
        email,
      }),
    )
  })

  it('should be able to authenticate with an valid email and password', async () => {
    const unexistentOrgId = randomUUID()

    await expect(() =>
      sut.execute({
        orgId: unexistentOrgId,
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })
})
