import { FastifyInstance } from 'fastify'
import { getById } from './get-by-id'

export const petUnsafeRoutes = (app: FastifyInstance) => {
  app.get(
    '/:petId',
    {
      onRequest: [],
    },
    getById,
  )
}
