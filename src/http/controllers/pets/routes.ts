import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'

export const orgRoutes = (app: FastifyInstance) => {
  app.post('/', create
}
