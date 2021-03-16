import { arg, extendType, idArg, intArg, nonNull } from 'nexus'

export const OrderQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('allOrders', {
      type: 'Order',
      args: {
        where: 'OrderWhereInput',
        take: intArg(),
        skip: intArg(),
      },
      resolve: async (_parent, { where, take, skip }, ctx) => {
        return await ctx.order.findManyOrder({
          where,
          take,
          skip,
        })
      },
    })

    t.nonNull.field('findOneOrder', {
      type: 'Order',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.order.findOneById({ id })
      },
    })

    t.nonNull.field('countAllOrders', {
      type: 'Int',
      args: {
        where: arg({ type: 'OrderWhereInput' }),
      },
      resolve: async (_parent, { where }, ctx) => {
        return await ctx.order.countAllOrders({ where })
      },
    })
  },
})
