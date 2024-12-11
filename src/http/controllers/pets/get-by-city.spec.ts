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

    await request(app.server)
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
    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Alfred',
        about: 'Alfred is another lovely pet',
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

    const anotherOrg = await prisma.org.create({
      data: {
        representant_name: 'Arthur Logan',
        email: 'arthurlogan@example.com',
        address: 'Wall Street, 52',
        city: 'New York',
        cep: '99999991',
        password_hash: 'my-passwword',
        phone: '5542999999991',
      },
    })

    await prisma.pet.create({
      data: {
        name: 'Call',
        about: 'Call is one more lovely pet',
        age: 7,
        energy_level: 4,
        environment: PetEnvironment.OPEN,
        org_id: anotherOrg.id,
        size: PetSize.SMALL,
      },
    })

    await prisma.pet.create({
      data: {
        name: 'Junior',
        about: 'Junior is one more lovely pet',
        age: 7,
        energy_level: 4,
        environment: PetEnvironment.OPEN,
        org_id: anotherOrg.id,
        size: PetSize.SMALL,
      },
    })

    const response = await request(app.server)
      .get(`/pets`)
      .query({
        city: 'New York',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.pets).toHaveLength(4)

    const paginatedResponse = await request(app.server)
      .get(`/pets`)
      .query({
        city: 'New York',
        page: 1,
        pageSize: 2,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(paginatedResponse.status).toEqual(200)
    expect(paginatedResponse.body.pets).toHaveLength(2)
    expect(paginatedResponse.body.pets[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
    })
  })
})
