import { objectType } from 'nexus'

export const Transaction = objectType({
  name: 'Transaction',
  definition: (t) => {
    t.nonNull.id('id')
    t.nonNull.string('recipientId')
    t.nonNull.string('senderId')
    t.nonNull.field('amount', { type: 'Decimal' })
    t.field('createdAt', { type: 'DateTime' })
  },
})
