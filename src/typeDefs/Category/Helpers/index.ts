import { inputObjectType } from 'nexus'

export const CategoryWhereInput = inputObjectType({
  name: 'CategoryWhereInput',
  definition: (t) => {
    t.field('category', { type: 'StringFilter' })
    t.field('createdAt', { type: 'DateTimeFilter' })
    t.field('id', { type: 'StringFilter' })
    t.field('updatedAt', { type: 'DateTimeFilter' })
  },
})

export const CreateCategoryInput = inputObjectType({
  name: 'CreateCategoryInput',
  definition: (t) => {
    t.string('category')
  },
})

export const OfferingCategoryListRelationFilter = inputObjectType({
  name: 'OfferingCategoryListRelationFilter',
  definition: (t) => {
    t.field('every', { type: 'CategoryWhereInput' })
    t.field('none', { type: 'CategoryWhereInput' })
    t.field('some', { type: 'CategoryWhereInput' })
  },
})

export const CategoryUpdateInput = inputObjectType({
  name: 'CategoryUpdateInput',
  definition: (t) => {
    t.string('category')
  },
})
