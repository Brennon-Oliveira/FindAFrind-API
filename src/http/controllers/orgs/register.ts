import { InvalidCepError } from '@/use-cases/errors/invalid-data-errors/invalid-cep-error'
import { InvalidEmailError } from '@/use-cases/errors/invalid-data-errors/invalid-email-error'
import { InvalidPhoneError } from '@/use-cases/errors/invalid-data-errors/invalid-phone-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/org/make-create-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    representant_name: z.string(),
    cep: z.string().length(8),
    address: z.string(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string().length(13),
  })

  const { representant_name, address, cep, email, password, phone } =
    registerBodySchema.parse(request.body)

  try {
    const createOrgUseCase = makeCreateOrgUseCase()

    await createOrgUseCase.execute({
      representant_name,
      address,
      cep,
      email,
      password,
      phone,
    })
    return reply.status(201).send()
  } catch (err) {
    if (err instanceof InvalidCepError) {
      return reply.status(400).send({
        message: err.message,
      })
    }
    if (err instanceof InvalidPhoneError) {
      return reply.status(400).send({
        message: err.message,
      })
    }
    if (err instanceof InvalidEmailError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw new Error('Internal server error')
  }
}
