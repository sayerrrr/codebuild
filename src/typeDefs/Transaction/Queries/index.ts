import { arg, extendType, idArg, intArg, nonNull } from 'nexus'

export const TransactionQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('allTransactions', {
      type: 'Transaction',
      args: {
        where: 'TransactionWhereInput',
        take: intArg(),
        skip: intArg(),
      },
      resolve: async (_parent, { where, take, skip }, ctx) => {
        return await ctx.transaction.findManyTransaction({
          where,
          take,
          skip,
        })
      },
    })

    t.list.field('allBusinessTransactions', {
      type: 'Transaction',
      args: {
        id: nonNull(idArg()),
        skip: intArg(),
        take: intArg(),
      },
      resolve: async (_parent, { id, skip, take }, ctx) => {
        return await ctx.transaction.findAllByBusiness({
          id,
          skip,
          take,
        })
      },
    })

    t.field('countAllTransactions', {
      type: 'Int',
      args: {
        where: arg({ type: 'TransactionWhereInput' }),
      },
      resolve: async (parent, { where }, ctx) => {
        return await ctx.transaction.countAllTransactions({ where })
      },
    })
  },
})
