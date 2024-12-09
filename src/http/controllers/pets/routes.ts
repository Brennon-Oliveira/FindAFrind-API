import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { create } from './create'
import { update } from './update'
import { markAsAdopted } from './mark-as-adopted'

export const petRoutes = (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.post('/', create)
  app.put('/', update)

  app.patch('/:petId/mark-as-adopt', markAsAdopted)
}
