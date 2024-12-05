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
    const { token } = await createAnOrgAndAuthenticate(app)

    const representant_name = 'New name'
    const address = 'Floor Street, 15'
    const cep = '11111111'
    const phone = '5542111111111'

    const response = await request(app.server)
      .put('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        representant_name,
        address,
        cep,
        phone,
      })

    expect(response.statusCode).toEqual(204)
  })
})
