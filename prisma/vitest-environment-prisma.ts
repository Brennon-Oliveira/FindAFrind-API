import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest/environments'

const generateDatabaseUrl = (schema: string): string => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    console.log(`URL: ${databaseUrl}`)

    process.env.DATABASE_URL = databaseUrl

    execSync('npm run prisma:deploy')

    console.log(`Database in schema ${schema} created`)

    return {
      async teardown() {
        await prisma.$queryRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        console.log(`Database in schema ${schema} deleted`)

        await prisma.$disconnect()
      },
    }
  },
}
