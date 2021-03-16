import { extendType, nonNull, stringArg } from 'nexus'

export const AuthQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('isInviteCodeValid', {
      type: 'Boolean',
      args: {
        code: nonNull(stringArg()),
      },
      resolve: async (_parent, { code }, ctx) => {
        return await ctx.services.auth.isInviteCodeValid(code)
      },
    })
  },
})
