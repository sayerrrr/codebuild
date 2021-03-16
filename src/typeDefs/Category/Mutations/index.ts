import { arg, extendType, idArg, nonNull } from 'nexus'

export const CategoryMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('createCategory', {
      type: 'OfferingCategory',
      args: {
        data: arg({ type: 'CreateCategoryInput' }),
      },
      resolve: async (_parent, { data }, ctx) => {
        // Get userID from context
        return await ctx.category.createCategory({ data })
      },
    })

    t.field('deleteOneCategory', {
      type: 'OfferingCategory',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.category.deleteCategory({ id })
      },
    })

    t.field('deleteManyCategory', {
      type: nonNull('BatchCount'),
      args: {
        where: nonNull(arg({ type: 'CategoryWhereInput' })),
      },
      resolve: async (_parent, { where }, ctx) => {
        return ctx.category.deleteManyCategory({ where })
      },
    })

    t.field('updateManyCategory', {
      type: 'BatchCount',
      args: {
        where: 'CategoryWhereInput',
        data: nonNull(arg({ type: 'CategoryUpdateInput' })),
      },
      resolve: async (parent, { where, data }, ctx) => {
        return await ctx.category.updateManyCategory({ where, data })
      },
    })
  },
})
