import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
