import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { request, GraphQLClient } from 'graphql-request'
import { nanoid } from 'nanoid'
import { join } from 'path'
import { Client } from 'pg'
import { server } from '../server'
import * as fake from 'faker'
import { registerUserMutation, createBusinessMutation } from './graphql'

type TestContext = {
  client: GraphQLClient
  db: PrismaClient
  businessA: any
  businessB: any
}

export function createTestContext(): TestContext {
  let ctx = {} as TestContext
  const graphqlCtx = graphqlTestContext()
  const prismaCtx = prismaTestContext()
  beforeAll(async () => {
    const client = graphqlCtx.before()
    const db = await prismaCtx.before()
    Object.assign(ctx, {
      client,
      db,
      request,
    })
  })
  afterAll(async () => {
    await graphqlCtx.after()
    await prismaCtx.after()
  })
  return ctx
}
function graphqlTestContext() {
  return {
    before() {
      return new GraphQLClient('http://localhost:4000/graphql')
    },
    async after() {
      server.close()
    },
  }
}
function prismaTestContext() {
  const prismaBinary = join(
    __dirname,
    '..',
    '..',
    'node_modules',
    '.bin',
    'prisma',
  )
  // Generate a unique schema identifier for this test context
  let schema = `test_${nanoid()}`
  let databaseUrl = ''
  let prismaClient: null | PrismaClient = null
  return {
    async before() {
      // Generate the pg connection string for the test schema

      databaseUrl = `${process.env.TESTING_DB}/testing?schema=${schema}`
      // Set the required environment variable to contain the connection string
      // to our database test schema
      process.env.POSTGRES_DEV = databaseUrl
      // Run the migrations to ensure our schema has the required structure
      execSync(`${prismaBinary} db push --preview-feature`, {
        env: {
          ...process.env,
          POSTGRES_DEV: databaseUrl,
        },
      })
      // Construct a new Prisma Client connected to the generated Postgres schema
      prismaClient = new PrismaClient()
      return prismaClient
    },
    async after() {
      // Drop the schema after the tests have completed
      const client = new Client({
        connectionString: databaseUrl,
      })
      await client.connect()
      await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
      await client.end()
      // Release the Prisma Client connection
      await prismaClient?.$disconnect()
    },
  }
}

export async function createTestObjects(ctx: TestContext) {
  // create User A
  let response = await ctx.client.request(registerUserMutation, {
    data: {
      email: 'usera@test.com',
      password: fake.internet.password(),
      lastName: fake.name.lastName(),
      firstName: fake.name.firstName(),
    },
  })
  let userA = response.registerUser
  // create User B
  response = await ctx.client.request(registerUserMutation, {
    data: {
      email: 'userb@test.com',
      password: fake.internet.password(),
      lastName: fake.name.lastName(),
      firstName: fake.name.firstName(),
    },
  })
  let userB = response.registerUser
  // create Business A with offering A
  const businessA = await ctx.client.request(createBusinessMutation, {
    data: {
      business: {
        ownerId: userA.user.id,
        creditAmount: 100,
        handle: 'businessA',
        name: 'businessA',
      },
      offerings: [
        {
          cost: 1000,
          title: 'offeringA',
        },
      ],
    },
  })

  // create Business B with offering B
  const businessB = await ctx.client.request(createBusinessMutation, {
    data: {
      business: {
        ownerId: userB.user.id,
        creditAmount: 50,
        handle: 'businessB',
        name: 'businessB',
      },
      offerings: [
        {
          cost: 10,
          title: 'offeringB',
        },
      ],
    },
  })

  Object.assign(ctx, {
    businessA: {
      token: userA.token,
      business: businessA.createBusinessWithOfferings,
    },
    businessB: {
      token: userB.token,
      business: businessB.createBusinessWithOfferings,
    },
  })
}
