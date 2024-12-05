import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAnOrgAndAuthenticate } from '@/utils/test/createAnOrgAndAuthenticate'

describe('Authenticate Org', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate with an org email and password', async () => {
    const { token, representant_name, address, cep, phone, email } =
      await createAnOrgAndAuthenticate(app)

    const response = await request(app.server)
      .get('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        representant_name,
        address,
        cep,
        phone,
        email,
      }),
    )
    expect(response.body.password_hash).toEqual(undefined)
  })
})
