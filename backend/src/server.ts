import Fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'

export const fastify = Fastify()

fastify.register(fastifyCors, {
  origin: env.ALLOW_CORS.split(','),
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['content-type', 'accept', 'content-type', 'authorization'],
})
fastify.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '7d',
  },
})

fastify.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issue: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  reply.status(500).send({ message: 'Internal Server Error' })
})

fastify
  .listen({
    host: '0.0.0.0',
    port: env.PORT || 3333,
  })
  .then(() => {
    console.log('HTTP Server Running 🚀')
  })
