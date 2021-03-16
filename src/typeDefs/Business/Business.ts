import { objectType } from 'nexus'

export const Business = objectType({
  name: 'Business',
  definition: (t) => {
    t.nonNull.string('id')
    t.string('description')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('ownerId')
    t.list.field('offerings', {
      type: 'Offering',
      resolve: async (parent, {}, ctx) => {
        return await ctx.offering.findMany({
          where: { businessId: parent.id },
        })
      },
    })
    t.string('address')
    t.nonNull.string('name')
    t.string('tagline')
    t.string('logoUrl')
    t.string('coverUrl')
    t.string('email')
    t.list.string('socialLinks')
    t.list.string('externalLinks')
    t.string('phoneNumber')
    t.int('creditAmount')
    t.int('creditScore')
    t.boolean('approved')
    t.nonNull.string('handle')
  },
})
