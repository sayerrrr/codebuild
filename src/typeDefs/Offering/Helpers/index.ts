import { inputObjectType } from 'nexus'

export const OfferingWhereInput = inputObjectType({
  name: 'OfferingWhereInput',
  definition: (t) => {
    t.list.field('AND', { type: 'OfferingWhereInput' })
    t.list.field('NOT', { type: 'OfferingWhereInput' })
    t.list.field('OR', { type: 'OfferingWhereInput' })
    t.field('address', { type: 'StringFilter' })
    t.field('businessId', { type: 'StringFilter' })
    t.field('categories', { type: 'OfferingCategoryListRelationFilter' })
    t.field('cost', { type: 'DecimalFilter' })
    t.field('createdAt', { type: 'DateTimeFilter' })
    t.field('description', { type: 'StringFilter' })
    t.field('id', { type: 'StringFilter' })
    t.field('isDisabled', { type: 'BoolFilter' })
    t.field('title', { type: 'StringFilter' })
    t.field('updatedAt', { type: 'DateTimeFilter' })
  },
})

export const OfferingListRelationFilter = inputObjectType({
  name: 'OfferingListRelationFilter',
  definition: (t) => {
    t.field('every', { type: 'OfferingWhereInput' })
    t.field('none', { type: 'OfferingWhereInput' })
    t.field('some', { type: 'OfferingWhereInput' })
  },
})

export const UpdateOfferingInput = inputObjectType({
  name: 'UpdateOfferingInput',
  definition: (t) => {
    t.int('cost')
    t.string('address')
    t.string('imageUrl')
    t.string('videoUrl')
    t.string('description')
    t.string('title')
  },
})
