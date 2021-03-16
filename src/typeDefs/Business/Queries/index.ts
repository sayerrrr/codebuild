import { arg, extendType, idArg, intArg, list, nonNull, stringArg } from 'nexus'

export const BusinessQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('findManyBusiness', {
      type: 'Business',
      args: {
        where: 'BusinessWhereInput',
        skip: intArg(),
        take: intArg(),
      },
      resolve: async (_parent, { where, skip, take }, ctx) => {
        return await ctx.business.findMany({ where, skip, take })
      },
    })

    t.field('findOneBusiness', {
      type: 'Business',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.business.findOneById({ id })
      },
    })

    t.nonNull.field('isHandleUnique', {
      type: 'Boolean',
      args: {
        handle: nonNull(stringArg()),
      },
      resolve: async (_parent, { handle }, ctx) => {
        return await ctx.business.isHandleUnique(handle)
      },
    })

    t.nonNull.field('businessBalance', {
      type: 'Decimal',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.business.getBusinessBalance({ id })
      },
    })

    t.field('countAllBusiness', {
      type: 'Int',
      args: { where: arg({ type: 'BusinessWhereInput' }) },
      resolve: async (parent, { where }, ctx) => {
        return await ctx.business.countAllBusiness({ where })
      },
    })
  },
})
