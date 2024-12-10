import { OrgNotFoundError } from '@/use-cases/errors/resource-not-found-errors/org-not-found-error'
import { makeGetPetsFromOrgUseCase } from '@/use-cases/factories/pet/make-get-pets-from-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const getByOrg = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const createPetUseCase = makeGetPetsFromOrgUseCase()

    const orgId = request.user.sub

    const { pets } = await createPetUseCase.execute({
      orgId,
    })

    return reply.status(200).send({
      pets,
    })
  } catch (err) {
    if (err instanceof OrgNotFoundError) {
      return reply.status(403).send({ message: err.message })
    }
    throw new Error('Internal server error')
  }
}
