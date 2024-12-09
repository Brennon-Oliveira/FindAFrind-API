import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { create } from './create'
import { update } from './update'

export const petRoutes = (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.post('/', create)
  app.put('/', update)
}
