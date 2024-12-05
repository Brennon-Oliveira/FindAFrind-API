import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAnOrgAndAuthenticate = async (app: FastifyInstance) => {
  const email = 'johndue@example.com'
  const password = '123456'
  const representant_name = 'John Doe'
  const address = 'Wall Street, 51'
  const cep = '99999999'
  const phone = '5542999999999'

  await request(app.server).post('/orgs').send({
    representant_name,
    address,
    cep,
    phone,
    email,
    password,
  })

  const response = await request(app.server).post('/orgs/auth').send({
    email,
    password,
  })

  const token = response.body.token

  return { token, representant_name, address, cep, phone, email, password }
}
