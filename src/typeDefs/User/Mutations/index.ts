import { arg, extendType, idArg, nonNull } from 'nexus';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('disableUser', {
      type: 'User',
      args: {
        id: nonNull(idArg()),
      },
      resolve: (_parent, args, ctx) => {
        return ctx.user.disableUser({ id: args.id })
      },
    })

    t.field('attachExistingCategoriesToUser', {
      type: 'User',
      args: {
        data: nonNull(arg({ type: 'AttachCategoriesInput' })),
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { data, id }, ctx) => {
        const connect = [] as any
        for (const id of data?.requestedCategories) {
          connect.push({ id })
        }
        return await ctx.user.updateUser({
          data: {
            requestedCategories: {
              connect,
            },
          },
          id,
        })
      },
    })

    t.field('updateManyUser', {
      type: 'BatchCount',
      args: {
        where: arg({ type: 'UserWhereInput' }),
        data: arg({ type: 'UserUpdateManyMutationInput' }),
      },
      resolve: async (_parent, { where, data }, ctx) => {
        return ctx.user.updateManyUser({ where, data })
      },
    })
  },
})
