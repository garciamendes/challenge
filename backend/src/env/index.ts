import 'dotenv/config'
import { z as zod } from 'zod'

const envSchema = zod.object({
  NODE_ENV: zod.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: zod.string(),
  DATABASE_URL: zod.string(),
  SALT_HASH: zod.coerce.number().default(10),
  ALLOW_CORS: zod.string(),
  PORT: zod.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
