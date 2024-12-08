import { InvalidCepError } from '@/use-cases/errors/invalid-data-errors/invalid-cep-error'
import { InvalidPhoneError } from '@/use-cases/errors/invalid-data-errors/invalid-phone-error'
import { makeUpdateOrgUseCase } from '@/use-cases/factories/org/make-update-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  const registerBodySchema = z.object({
    representant_name: z.string(),
    cep: z.string().length(8),
    address: z.string(),
    phone: z.string().length(13),
  })

  const { representant_name, address, cep, phone } = registerBodySchema.parse(
    request.body,
  )

  try {
    const updateOrgUseCase = makeUpdateOrgUseCase()

    const id = request.user.sub

    await updateOrgUseCase.execute({
      id,
      representant_name,
      address,
      cep,
      phone,
    })
    return reply.status(204).send()
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

    throw new Error('Internal server error')
  }
}
