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

  it('should be able to mark an pet as adopted', async () => {
    const { token } = await createAnOrgAndAuthenticate(app)

    const petBobResponse = await request(app.server)
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
          create: [],
        },
        petPhotos: {
          create: [],
        },
      })

    const petId = petBobResponse.body.petId

    const response = await request(app.server).get(`/pets/${petId}`).send()

    const petBob = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    })

    expect(response.status).toEqual(200)
    expect(response.body.pet).toEqual(petBob ? { ...petBob } : {})
  })
})
