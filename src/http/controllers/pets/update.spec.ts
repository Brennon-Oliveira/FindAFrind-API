import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAnOrgAndAuthenticate } from '@/utils/test/createAnOrgAndAuthenticate'
import { prisma } from '@/lib/prisma'
import { PetEnvironment, PetSize } from '@prisma/client'

describe('Update Pet', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update an pet', async () => {
    const { token } = await createAnOrgAndAuthenticate(app)

    const createPetResponse = await request(app.server)
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
              requeriment: 'First Requeriment to delete',
            },
            {
              requeriment: 'Second Requeriment to delete',
            },
          ],
        },
        petPhotos: {
          create: [
            {
              url: 'my-url-to-delete',
            },
          ],
        },
      })

    const petId = createPetResponse.body.petId

    const petPhotos = await prisma.petPhoto.findMany({
      where: {
        pet_id: petId,
      },
    })

    const adoptRequeriments = await prisma.adoptRequeriment.findMany({
      where: {
        pet_id: petId,
      },
    })

    const newName = 'New Bob'

    const response = await request(app.server)
      .put('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: petId,
        name: newName,
        about: 'Bob is a very very lovely pet',
        age: 2,
        energyLevel: 4,
        environment: PetEnvironment.CLOSE,
        size: PetSize.SMALL,
        adoptRequeriments: {
          create: [
            {
              requeriment: 'First Requeriment',
            },
            {
              requeriment: 'Second Requeriment',
            },
          ],
          delete: adoptRequeriments.map(
            (adoptRequeriment) => adoptRequeriment.id,
          ),
        },
        petPhotos: {
          create: [
            {
              url: 'my-url',
            },
          ],
          delete: petPhotos.map((petPhoto) => petPhoto.id),
        },
      })

    expect(response.status).toEqual(204)

    const updatedPet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    })

    expect(updatedPet?.name).toEqual(newName)

    const newPetPhotos = await prisma.petPhoto.findMany({
      where: {
        pet_id: petId,
      },
    })

    expect(newPetPhotos).toHaveLength(1)
    expect(newPetPhotos[0].url).not.contain('to-delete')

    const newAdoptRequeriments = await prisma.adoptRequeriment.findMany({
      where: {
        pet_id: petId,
      },
    })

    expect(newAdoptRequeriments).toHaveLength(2)
    expect(newAdoptRequeriments[0].requeriment).not.contain('to delete')
  })
})
