import { OrgNotFoundError } from '@/use-cases/errors/resource-not-found-errors/org-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/pet/make-create-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createPetBodySchema = {}

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const orgId = request.user.sub

    
    return reply.status(200).send({
      ...org,
      password_hash: undefined,
    })
  } catch (err) {
    if (err instanceof OrgNotFoundError) {
      return reply.status(403).send({ message: err.message })
    }
    throw new Error('Internal server error')
  }
}
