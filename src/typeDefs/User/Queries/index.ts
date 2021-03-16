import { GraphQLError } from 'graphql'
import { arg, extendType, idArg, intArg, nonNull, stringArg } from 'nexus'
import { isAuthenticatedUser } from '../../../services/auth/permissions/index'

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('findAllUsers', {
      type: 'User',
      args: {
        where: 'UserWhereInput',
        skip: intArg(),
        take: intArg(),
      },
      resolve: async (_parent, { where, skip, take }, ctx) => {
        return await ctx.user.findMany({ where, skip, take })
      },
    })

    t.field('findUserById', {
      type: 'User',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.user.findOneById({ id })
      },
    })

    t.field('findUserByEmail', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_parent, { email }, ctx) => {
        if (!email) throw new GraphQLError('email is required')
        return await ctx.user.findOneByEmail({ email })
      },
    })

    t.field('me', {
      type: 'User',
      resolve: (_parent, _args, ctx) => {
        const { headers } = ctx.req
        const { authenticated, id } = isAuthenticatedUser(headers)
        if (authenticated && id) {
          return ctx.user.findOneById({ id })
        }
        return null
      },
    })

    t.field('isEmailUnique', {
      type: 'Boolean',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_parent, { email }, ctx) => {
        return await ctx.user.isEmailUnique(email)
      },
    })

    t.field('countAllUsers', {
      type: 'Int',
      args: {
        where: arg({ type: 'UserWhereInput' }),
      },
      resolve: async (_parent, { where }, ctx) => {
        return await ctx.user.countAllUsers({ where })
      },
    })
  },
})
