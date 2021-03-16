import { arg, extendType, idArg, nonNull } from 'nexus'

export const BusinessMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('createBusiness', {
      type: 'Business',
      args: {
        data: arg({ type: 'CreateBusinessInput' }),
      },
      resolve: async (_parent, { data }, ctx) => {
        return await ctx.business.createBusiness({ data })
      },
    })

    t.nonNull.field('createBusinessWithOfferings', {
      type: 'Business',
      args: {
        data: arg({ type: 'CreateBusinessWithOfferingsInput' }),
      },
      resolve: async (_parent, { data }, ctx) => {
        return await ctx.business.createBusinessWithOfferings({ data })
      },
    })

    t.nonNull.field('updateBusiness', {
      type: 'Business',
      args: {
        data: arg({ type: nonNull('BusinessUpdateInput') }),
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { data, id }, ctx) => {
        return await ctx.business.updateOneBusiness({ data, id })
      },
    })

    t.nonNull.field('disableBusiness', {
      type: 'Business',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.business.disableBusiness({ id })
      },
    })

    t.field('updateManyBusiness', {
      type: nonNull('BatchCount'),
      args: {
        where: 'BusinessWhereInput',
        data: nonNull('BusinessUpdateManyMutationInput'),
      },
      resolve(_parent, { where, data }, ctx) {
        return ctx.business.updateManyBusiness({ where, data })
      },
    })
  },
})
