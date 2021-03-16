import { arg, extendType } from 'nexus'
import { isAuthenticatedUser } from '../../../services/auth/permissions'

export const TransactionMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('createTransaction', {
      type: 'Transaction',
      args: {
        data: arg({ type: 'CreateTransactionInput' }),
      },
      resolve: async (_parent, { data }, ctx) => {
        const { id } = isAuthenticatedUser(ctx.req.headers)
        if (!data) throw new Error('Invalid input')
        if (!id) throw new Error('Not authorized to create a transaction')
        if (id === data.recipientId)
          throw new Error('Recipient and Sender can not be the same')

        const senderBalance = await ctx.business.getBusinessBalance({
          id: data?.senderId || '',
        })
        const senderBusiness = await ctx.business.findOneById({
          id: data?.senderId || '',
        })

        if (id != senderBusiness.ownerId)
          // TODO include check for admin role
          throw new Error(
            'Not authorized to create a transaction on behalf of another user',
          )

        return await ctx.transaction.createTransaction({
          data,
          senderBalance,
          senderBusiness,
        })
      },
    })
  },
})
