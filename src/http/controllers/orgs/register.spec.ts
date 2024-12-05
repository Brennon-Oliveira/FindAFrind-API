import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register Org', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register an org', async () => {
    const response = await request(app.server).post('/orgs').send({
      representant_name: 'John Doe',
      address: 'Wall Street, 51',
      cep: '99999999',
      phone: '5542999999999',
      email: 'johndue@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
