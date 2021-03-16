import { inputObjectType, enumType } from 'nexus'
import { IntFilter } from '../../Helpers/index'

export const CreateOrderInput = inputObjectType({
  name: 'CreateOrderInput',
  definition: (t) => {
    t.nonNull.string('offeringId')
    t.nonNull.int('quantity')
    t.nonNull.string('note')
  },
})

export const OrderWhereUniqueInput = inputObjectType({
  name: 'OrderWhereUniqueInput',
  definition: (t) => {
    t.string('id')
  },
})

export const OrderWhereInput = inputObjectType({
  name: 'OrderWhereInput',
  definition: (t) => {
    t.list.field('AND', { type: 'OrderWhereInput' })
    t.list.field('NOT', { type: 'OrderWhereInput' })
    t.list.field('OR', { type: 'OrderWhereInput' })
    t.field('amount', { type: 'DecimalFilter' })
    t.field('createdAt', { type: 'DateTimeFilter' })
    t.field('id', { type: 'StringFilter' })
    t.field('offering', { type: 'OfferingWhereInput' })
    t.field('offeringId', { type: 'StringFilter' })
    t.field('transaction', { type: 'TransactionWhereInput' })
    t.field('transactionId', { type: 'StringFilter' })
    t.field('quantity', { type: 'IntFilter' })
    t.field('note', { type: 'StringFilter' })
    t.field('state', { type: 'OrderStateFilter' })
  },
})

export const OrderState = enumType({
  name: 'OrderState',
  members: ['PENDING', 'PAID', 'REFUNDED'],
})
