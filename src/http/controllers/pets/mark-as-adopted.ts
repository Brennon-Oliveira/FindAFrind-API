import { PetIsNotFromOrgIdError } from '@/use-cases/errors/pet-errors/pet-is-not-from-org-error'
import { PetNotFoundError } from '@/use-cases/errors/resource-not-found-errors/pet-not-found-error'
import { makeSetPetAsAdoptedUseCase } from '@/use-cases/factories/pet/make-set-pet-as-adopted-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const markAsAdopted = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const createPetBodySchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = createPetBodySchema.parse(request.params)

  try {
    const createPetUseCase = makeSetPetAsAdoptedUseCase()

    const orgId = request.user.sub

    const { pet } = await createPetUseCase.execute({
      petId,
      orgId,
    })

    return reply.status(204).send({
      petId: pet.id,
    })
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      return reply.status(403).send({ message: err.message })
    }
    if (err instanceof PetIsNotFromOrgIdError) {
      return reply.status(401).send({ message: err.message })
    }
    throw new Error('Internal server error')
  }
}
