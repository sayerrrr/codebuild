import { arg, extendType, idArg, inputObjectType, nonNull } from 'nexus'

export const CreateOfferingInput = inputObjectType({
  name: 'CreateOfferingInput',
  definition: (t) => {
    t.string('address')
    t.nonNull.string('businessId')
    t.nonNull.int('cost')
    t.string('description')
    t.string('imageUrl')
    t.string('title')
    t.string('videoUrl')
    t.string('categoryId')
  },
})

export const CreateOfferingWithoutBusinessInput = inputObjectType({
  name: 'CreateOfferingWithoutBusinessInput',
  definition: (t) => {
    t.string('address')
    t.nonNull.int('cost')
    t.string('description')
    t.string('imageUrl')
    t.string('title')
    t.string('videoUrl')
    t.string('categoryId')
  },
})

export const OfferingMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('createOffering', {
      type: 'Offering',
      args: {
        data: arg({ type: 'CreateOfferingInput' }),
      },
      resolve: async (_parent, { data }, ctx) => {
        return await ctx.offering.createOffering({ data })
      },
    })

    t.field('updateOffering', {
      type: 'Offering',
      args: {
        data: arg({ type: 'UpdateOfferingInput' }),
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { data, id }, ctx) => {
        return await ctx.offering.updateOffering({ data, id })
      },
    })

    t.field('disableOffering', {
      type: 'Offering',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.offering.disableOffering({ id })
      },
    })

    t.field('attachExistingCategoriesToOffering', {
      type: 'Offering',
      args: {
        data: nonNull(arg({ type: 'AttachCategoriesInput' })),
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { data, id }, ctx) => {
        const connect = [] as any
        for (const id of data?.requestedCategories) {
          connect.push({ id })
        }
        return await ctx.offering.updateOffering({
          data: {
            requestedCategories: {
              connect,
            },
          },
          id,
        })
      },
    })
  },
})
