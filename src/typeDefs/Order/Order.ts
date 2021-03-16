import { objectType } from 'nexus'

export const Order = objectType({
  name: 'Order',
  definition: (t) => {
    t.nonNull.string('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('offeringId')
    t.nonNull.string('transactionId')
    t.nonNull.int('quantity')
    t.nonNull.string('note')
    t.nonNull.field('state', { type: 'OrderState' })
    t.nonNull.field('amount', { type: 'Decimal' })
  },
})
