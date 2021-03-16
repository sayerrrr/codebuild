import { arg, extendType, idArg, intArg, nonNull } from 'nexus'

export const CategpryQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('findOneCategory', {
      type: 'OfferingCategory',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.category.findOneCategory({
          id,
        })
      },
    })

    t.list.field('findManyCategory', {
      type: 'OfferingCategory',
      args: {
        where: arg({ type: 'CategoryWhereInput' }),
        skip: intArg(),
        take: intArg(),
      },
      resolve: async (_parent, { where, skip, take }, ctx) => {
        return await ctx.category.findManyCategories({
          where,
          skip,
          take,
        })
      },
    })

    t.field('countAllCategory', {
      type: 'Int',
      args: { where: arg({ type: 'CategoryWhereInput' }) },
      resolve: async (parent, { where }, ctx) => {
        return await ctx.category.countAllCategory({ where })
      },
    })
  },
})
