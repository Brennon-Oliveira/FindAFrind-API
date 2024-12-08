import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateOnOrgUseCase } from '@/use-cases/factories/org/make-authenticate-on-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateOnOrgUseCase = makeAuthenticateOnOrgUseCase()

    const { org } = await authenticateOnOrgUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign({}, { sub: org.id })

    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw new Error('Internal server error')
  }
}
