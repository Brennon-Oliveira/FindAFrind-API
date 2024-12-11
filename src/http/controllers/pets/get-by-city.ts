import { makeGetPetsFromCityUseCase } from '@/use-cases/factories/pet/make-get-pets-from-city-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getByCity = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const getByCityQuerySchema = z.object({
    city: z.string(),
    page: z.coerce.number().optional(),
    pageSize: z.coerce.number().optional(),
  })

  const { city, page, pageSize } = getByCityQuerySchema.parse(request.query)

  try {
    const createPetUseCase = makeGetPetsFromCityUseCase()

    const { pets, total } = await createPetUseCase.execute({
      city,
      page,
      pageSize,
    })

    return reply.status(200).send({
      pets,
      total,
    })
  } catch (err) {
    throw new Error('Internal server error')
  }
}
