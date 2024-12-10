import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { create } from './create'
import { update } from './update'
import { markAsAdopted } from './mark-as-adopted'
import { getByOrg } from './get-by-org'
import { getByCity } from './get-by-city'

export const petRoutes = (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.post('/', create)
  app.put('/', update)
  app.get('/', getByCity)
  app.get('/org', getByOrg)

  app.patch('/:petId/mark-as-adopt', markAsAdopted)
}
