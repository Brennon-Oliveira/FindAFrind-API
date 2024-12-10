import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Authenticate Org', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate with an org email and password', async () => {
    const email = 'johndue@example.com'
    const password = '123456'

    await request(app.server).post('/orgs').send({
      representant_name: 'John Doe',
      address: 'Wall Street, 51',
      cep: '99999999',
      city: 'New York',
      phone: '5542999999999',
      email,
      password,
    })

    const response = await request(app.server).post('/orgs/auth').send({
      email,
      password,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })
})
