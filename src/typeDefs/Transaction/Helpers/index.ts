import { inputObjectType } from 'nexus'

export const CreateTransactionInput = inputObjectType({
  name: 'CreateTransactionInput',
  definition: (t) => {
    t.nonNull.string('recipientId')
    t.nonNull.string('senderId')
    t.nonNull.field('amount', { type: 'Decimal' })
  },
})

export const TransactionWhereUniqueInput = inputObjectType({
  name: 'TransactionWhereUniqueInput',
  definition: (t) => {
    t.string('id')
  },
})

export const TransactionWhereInput = inputObjectType({
  name: 'TransactionWhereInput',
  definition: (t) => {
    t.list.field('AND', { type: 'TransactionWhereInput' })
    t.list.field('NOT', { type: 'TransactionWhereInput' })
    t.list.field('OR', { type: 'TransactionWhereInput' })
    t.field('amount', { type: 'DecimalFilter' })
    t.field('createdAt', { type: 'DateTimeFilter' })
    t.field('id', { type: 'StringFilter' })
    t.field('offering', { type: 'OfferingWhereInput' })
    t.field('offeringId', { type: 'StringFilter' })
    t.field('recipient', { type: 'BusinessWhereInput' })
    t.field('recipientId', { type: 'StringFilter' })
    t.field('sender', { type: 'BusinessWhereInput' })
    t.field('senderId', { type: 'StringFilter' })
  },
})
