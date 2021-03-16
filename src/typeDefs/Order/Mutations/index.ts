import { arg, extendType, nonNull, idArg } from 'nexus'
import { isAuthenticatedUser } from '../../../services/auth/permissions/index'

export const OrderMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('createOrder', {
      type: 'Order',
      args: {
        data: arg({ type: 'CreateOrderInput' }),
      },
      resolve: async (_parent, { data }, ctx) => {
        const { id } = isAuthenticatedUser(ctx.req.headers)
        if (!id) throw new Error('Not authorized to create an order')
        if (!data) throw new Error('Invalid input')

        const currentUserBusiness = (await ctx.business.findByOwner({ id }))[0]

        const offering = await ctx.offering.findOneById({
          id: data?.offeringId || '',
          include: { business: true },
        })
        if (!offering) throw new Error('Offering does not exist')

        if (offering.businessId === id)
          throw new Error('Offering is owned by purchaser')

        if (data?.quantity === 0 || !data)
          throw new Error('Order quantity must be greater than 0')

        const totalCost = (data.quantity || 0) * (offering.cost || 0)

        const txData = {
          recipientId: offering.businessId,
          senderId: currentUserBusiness.id,
          amount: totalCost,
          offeringId: offering.id,
        }

        const senderBalance = await ctx.business.getBusinessBalance({
          id: currentUserBusiness.id || '',
        })
        const senderBusiness = await ctx.business.findOneById({
          id: currentUserBusiness.id || '',
        })

        const tx = await ctx.transaction.createTransaction({
          data: txData,
          senderBalance,
          senderBusiness,
        })

        return await ctx.order.createOrder({ data, transaction: tx, offering })
      },
    })

    t.nonNull.field('issueOrderRefund', {
      type: 'Order',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, { id }, ctx) => {
        return await ctx.order.issueRefund({ id })
      },
    })
  },
})
