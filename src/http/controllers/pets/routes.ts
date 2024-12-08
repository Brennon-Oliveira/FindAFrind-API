import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { create } from './create'

export const orgRoutes = (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.post('/', create)
}
