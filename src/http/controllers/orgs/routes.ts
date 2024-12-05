import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'

export const orgRoutes = (app: FastifyInstance) => {
  app.post('/', register)

  app.post('/auth', authenticate)
}
