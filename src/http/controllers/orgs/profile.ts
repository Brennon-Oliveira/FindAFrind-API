import { OrgNotFoundError } from '@/use-cases/errors/resource-not-found-errors/org-not-found-error'
import { makeGetOrgByIdUseCase } from '@/use-cases/factories/make-get-org-by-id-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const createOrgUseCase = makeGetOrgByIdUseCase()

    const orgId = request.user.sub

    const { org } = await createOrgUseCase.execute({
      orgId,
    })
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
