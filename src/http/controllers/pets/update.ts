import { OrgNotFoundError } from '@/use-cases/errors/resource-not-found-errors/org-not-found-error'
import { makeUpdatePetUseCase } from '@/use-cases/factories/pet/make-update-pet-use-case'
import { PetEnvironment, PetSize } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  const updatePetBodySchema = z.object({
    id: z.string(),
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
      delete: z.string().array(),
    }),
    petPhotos: z.object({
      create: z
        .object({
          url: z.string(),
        })
        .array(),
      delete: z.string().array(),
    }),
  })

  const {
    id,
    name,
    about,
    age,
    energyLevel,
    environment,
    size,
    adoptRequeriments,
    petPhotos,
  } = updatePetBodySchema.parse(request.body)

  try {
    const updatePetUseCase = makeUpdatePetUseCase()

    const orgId = request.user.sub

    await updatePetUseCase.execute({
      id,
      name,
      about,
      age,
      orgId,
      energyLevel,
      environment,
      size,
      adoptRequeriments,
      petPhotos,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof OrgNotFoundError) {
      return reply.status(403).send({ message: err.message })
    }
    throw new Error('Internal server error')
  }
}
