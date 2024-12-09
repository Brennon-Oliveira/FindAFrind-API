import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAnOrgAndAuthenticate } from '@/utils/test/createAnOrgAndAuthenticate'
import { prisma } from '@/lib/prisma'
import { PetEnvironment, PetSize } from '@prisma/client'

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
      .send({
        name: 'Bob',
        about: 'Bob is a lovely pet',
        age: 5,
        energyLevel: 3,
        environment: PetEnvironment.BOTH,
        size: PetSize.MEDIUM,
        adoptRequeriments: {
          create: [
            {
              requeriment: 'First Requeriment',
            },
            {
              requeriment: 'Second Requeriment',
            },
          ],
        },
        petPhotos: {
          create: [
            {
              url: 'my-url',
            },
          ],
        },
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        petId: expect.any(String),
      }),
    )

    const totalOfPets = await prisma.pet.count()

    expect(totalOfPets).toEqual(1)
  })
})
