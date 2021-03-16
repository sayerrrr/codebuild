import { applyMiddleware } from 'graphql-middleware'
import { makeSchema } from 'nexus'
import * as path from 'path'

import * as types from './typeDefs'

// import { permissions } from './permissions'

export const schema = applyMiddleware(
  makeSchema({
    types,
    shouldExitAfterGenerateArtifacts: process.argv.includes('--nexus-exit'),
    sourceTypes: {
      modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
    },
    contextType: {
      module: path.join(__dirname, 'context.ts'),
      export: 'Context',
    },
    outputs: {
      typegen: path.join(
        __dirname,
        '../node_modules/@types/nexus-typegen/index.d.ts',
      ),
      schema: path.join(__dirname, './schema.graphql'),
    },
  }),
  // TODO add back with specific rules
  // permissions,
)
