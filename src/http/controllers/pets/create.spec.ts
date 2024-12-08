import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAnOrgAndAuthenticate } from '@/utils/test/createAnOrgAndAuthenticate'
import { prisma } from '@/lib/prisma'

describe('Create Pet', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an pet', async () => {
    const { token } = await createAnOrgAndAuthenticate(app)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(201)

    const totalOfPets = await prisma.pet.count()

    expect(totalOfPets).toEqual(1)
  })
})
