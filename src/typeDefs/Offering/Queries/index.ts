import { extendType, list, nonNull, arg, intArg, idArg } from 'nexus'

export const OfferingQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('findManyOffering', {
      type: nonNull(list(nonNull('Offering'))),
      args: {
        where: arg({ type: 'OfferingWhereInput' }),
        skip: intArg(),
        take: intArg(),
      },
      resolve: async (_parent, { where, skip, take }, ctx) => {
        return ctx.offering.findMany({
          where,
          skip,
          take,
        })
      },
    })

    t.field('findOneOffering', {
      type: 'Offering',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.offering.findOneById({
          id,
        })
      },
    })

    t.list.field('findByBusiness', {
      type: 'Offering',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.offering.findMany({
          where: {
            businessId: id,
          },
        })
      },
    })

    t.field('countAllOffering', {
      type: 'Int',
      args: { where: 'OfferingWhereInput' },
      resolve: async (parent, { where }, ctx) => {
        return await ctx.offering.countAllOffering({ where })
      },
    })
  },
})
