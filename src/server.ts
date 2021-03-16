import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { schema } from './schema'
import log from './lib/logger'
import { PrismaClient } from '@prisma/client'
import { buildContext } from './context'

const prisma = new PrismaClient()

export const apollo = new ApolloServer({
  context: (req: any) => {
    return buildContext(req, prisma)
  },
  schema,
})

const app = express()

apollo.applyMiddleware({ app })

export const server = app.listen(80, () => {
  log.http(`Server listening @ http://localhost/graphql`)
})
