import { objectType } from 'nexus'

export const OfferingCategory = objectType({
  name: 'OfferingCategory',
  definition: (t) => {
    t.nonNull.id('id')
    t.nonNull.string('category')
    t.nonNull.field('createdAt', { type: 'DateTime' })
  },
})
