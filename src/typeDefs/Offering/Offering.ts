import { objectType } from 'nexus'

export const Offering = objectType({
  name: 'Offering',
  definition: (t) => {
    t.nonNull.id('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('businessId')
    t.nonNull.int('cost')
    t.string('address')
    t.string('imageUrl')
    t.string('videoUrl')
    t.string('description')
    t.string('title')
    t.list.field('categories', {
      type: 'OfferingCategory',
      resolve: async (parent, _args, ctx) => {
        return await ctx.category.findByOffering({ id: parent.id })
      },
    })
  },
})
