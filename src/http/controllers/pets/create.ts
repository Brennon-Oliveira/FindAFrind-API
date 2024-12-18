import { OrgNotFoundError } from '@/use-cases/errors/resource-not-found-errors/org-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/pet/make-create-pet-use-case'
import { PetEnvironment, PetSize } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.coerce.number(),
    energyLevel: z.coerce.number(),
    environment: z.nativeEnum(PetEnvironment),
    size: z.nativeEnum(PetSize),
    adoptRequeriments: z.object({
      create: z
        .object({
          requeriment: z.string(),
        })
        .array(),
    }),
    petPhotos: z.object({
      create: z
        .object({
          url: z.string(),
        })
        .array(),
    }),
  })

  const {
    name,
    about,
    age,
    energyLevel,
    environment,
    size,
    adoptRequeriments,
    petPhotos,
  } = createPetBodySchema.parse(request.body)

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const orgId = request.user.sub

    const { pet } = await createPetUseCase.execute({
      name,
      about,
      age,
      energyLevel,
      environment,
      orgId,
      size,
      adoptRequeriments,
      petPhotos,
    })

    return reply.status(201).send({
      petId: pet.id,
    })
  } catch (err) {
    if (err instanceof OrgNotFoundError) {
      return reply.status(403).send({ message: err.message })
    }
    throw new Error('Internal server error')
  }
}
