import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { env } from './env'
import { orgRoutes } from './http/controllers/orgs/routes'
import { ZodError } from 'zod'
import { petRoutes } from './http/controllers/pets/routes'
import { petUnsafeRoutes } from './http/controllers/pets/unsafeRoutes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(orgRoutes, {
  prefix: '/orgs',
})

app.register(petRoutes, {
  prefix: '/pets',
})

app.register(petUnsafeRoutes, {
  prefix: '/pets',
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we shouuld log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
})
