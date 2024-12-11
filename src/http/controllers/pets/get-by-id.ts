import { PetNotFoundError } from '@/use-cases/errors/resource-not-found-errors/pet-not-found-error'
import { makeGetPetByIdUseCase } from '@/use-cases/factories/pet/make-get-pet-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getById = async (request: FastifyRequest, reply: FastifyReply) => {
  const getByIdParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = getByIdParamsSchema.parse(request.params)

  try {
    const getPetByIdUseCase = makeGetPetByIdUseCase()

    const { pet } = await getPetByIdUseCase.execute({
      petId,
    })

    return reply.status(200).send({ pet })
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      return reply.status(403).send()
    }

    throw new Error('Internal server error')
  }
}
