import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { update } from './update'
import { profile } from './profile'
import { verifyJWT } from '@/http/middleware/verify-jwt'

export const orgRoutes = (app: FastifyInstance) => {
  app.post('/', register)
  app.put(
    '/',
    {
      onRequest: [verifyJWT],
    },
    update,
  )
  app.get(
    '/',
    {
      onRequest: [verifyJWT],
    },
    profile,
  )

  app.post('/auth', authenticate)
}
