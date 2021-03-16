import { inputObjectType } from 'nexus'

export const BusinessWhereInput = inputObjectType({
  name: 'BusinessWhereInput',
  definition: (t) => {
    t.list.field('AND', { type: 'BusinessWhereInput' })
    t.list.field('NOT', { type: 'BusinessWhereInput' })
    t.list.field('OR', { type: 'BusinessWhereInput' })
    t.field('address', { type: 'StringFilter' })
    t.field('name', { type: 'StringFilter' })
    t.field('tagline', { type: 'StringFilter' })
    t.field('approved', { type: 'BoolFilter' })
    t.field('coverUrl', { type: 'StringFilter' })
    t.field('createdAt', { type: 'DateTimeFilter' })
    t.field('creditAmount', { type: 'IntFilter' })
    t.field('creditScore', { type: 'IntFilter' })
    t.field('email', { type: 'StringFilter' })
    t.field('phoneNumber', { type: 'StringFilter' })
    t.field('description', { type: 'StringFilter' })
    t.field('handle', { type: 'StringFilter' })
    t.field('id', { type: 'StringFilter' })
    t.field('isDisabled', { type: 'BoolFilter' })
    t.field('ownerId', { type: 'StringFilter' })
    t.field('updatedAt', { type: 'DateTimeFilter' })
  },
})

export const BusinessUpdateManyMutationInput = inputObjectType({
  name: 'BusinessUpdateManyMutationInput',
  definition: (t) => {
    t.field('creditAmount', { type: 'IntUpdateInput' })
    t.field('creditScore', { type: 'IntUpdateInput' })
    t.field('isDisabled', { type: 'BoolUpdateInput' })
  },
})

export const CreateBusinessInput = inputObjectType({
  name: 'CreateBusinessInput',
  definition: (t) => {
    t.string('description')
    t.nonNull.string('ownerId')
    t.string('address')
    t.string('logoUrl')
    t.string('tagline')
    t.string('email')
    t.nonNull.string('name')
    t.string('coverUrl')
    t.list.string('socialLinks')
    t.list.string('externalLinks')
    t.string('phoneNumber')
    t.int('creditAmount')
    t.int('creditScore')
    t.nonNull.string('handle')
  },
})

export const CreateBusinessWithOfferingsInput = inputObjectType({
  name: 'CreateBusinessWithOfferingsInput',
  definition: (t) => {
    t.nonNull.field('business', { type: 'CreateBusinessInput' })
    t.list.field('offerings', { type: 'CreateOfferingWithoutBusinessInput' })
  },
})

export const BusinessUpdateInput = inputObjectType({
  name: 'BusinessUpdateInput',
  definition: (t) => {
    t.string('description')
    t.string('address')
    t.string('logoUrl')
    t.string('tagline')
    t.string('name')
    t.string('email')
    t.string('coverUrl')
    t.list.string('socialLinks')
    t.list.string('externalLinks')
    t.string('phoneNumber')
    t.int('creditAmount')
    t.int('creditScore')
    t.boolean('approved')
    t.string('handle')
  },
})

export const BusinessListRelationFilter = inputObjectType({
  name: 'BusinessListRelationFilter',
  definition: (t) => {
    t.field('every', { type: BusinessWhereInput })
    t.field('none', { type: BusinessWhereInput })
    t.field('some', { type: BusinessWhereInput })
  },
})
