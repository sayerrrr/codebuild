import { createTestContext, createTestObjects } from './__helpers'
import {
  createTransactionMutation,
  businessBalanceQuery,
  createOrderMutation,
  issueOrderRefundMutation,
  allOrdersQuery,
} from './graphql'

const ctx = createTestContext()

describe('Generate Test Users, Businesses, and Offerings ', () => {
  it('ensures 2 user objects were created', async () => {
    await createTestObjects(ctx)
    expect(ctx.businessA.token).toBeDefined()
    expect(ctx.businessB.token).toBeDefined()
  })
  it('ensures 2 business objects were created', () => {
    expect(ctx.businessA.business).toBeDefined()
    expect(ctx.businessB.business).toBeDefined()
  })
})

describe('Test Transactions', () => {
  it('ensures a transaction from BusinessA to BusinessB is rejected for insufficient funds', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessA.token}`)
    const tx = ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessB.business.id,
        senderId: ctx.businessA.business.id,
        amount: 101,
      },
    })
    await expect(async () => await tx).rejects.toThrowError()
  })
  it('ensures a transaction from BusinessA to BusinessB for $50', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessA.token}`)
    await ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessB.business.id,
        senderId: ctx.businessA.business.id,
        amount: 50,
      },
    })

    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('-50')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('50')
  })
  it('ensures a transaction from BusinessB to BusinessA for $151 is rejected for insufficient funds', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessB.token}`)
    const tx = ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessA.business.id,
        senderId: ctx.businessB.business.id,
        amount: 101,
      },
    })
    expect(async () => await tx).rejects.toThrowError()
  })
  it('ensures a transaction from BusinessB to BusinessA for $150', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessB.token}`)
    await ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessA.business.id,
        senderId: ctx.businessB.business.id,
        amount: 75,
      },
    })

    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('25')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('-25')
  })
  it('ensures a transaction from BusinessA to BusinessB for $150', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessA.token}`)
    await ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessB.business.id,
        senderId: ctx.businessA.business.id,
        amount: 25.5,
      },
    })

    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('-0.5')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('0.5')
  })
  it('ensures a transaction from BusinessB to BusinessA for $0.5', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessB.token}`)
    await ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessA.business.id,
        senderId: ctx.businessB.business.id,
        amount: 0.5,
      },
    })

    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('0')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('0')
  })
  it('ensures a transaction from BusinessB to BusinessA for -$10 is rejected for negative amount value', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessB.token}`)
    const tx = ctx.client.request(createTransactionMutation, {
      data: {
        recipientId: ctx.businessA.business.id,
        senderId: ctx.businessB.business.id,
        amount: -10,
      },
    })
    expect(async () => await tx).rejects.toThrowError()
  })
})

describe('Test Orders', () => {
  it('ensures an order from businessA for offering B', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessA.token}`)
    const orderResponse = await ctx.client.request(createOrderMutation, {
      data: {
        offeringId: ctx.businessB.business.offerings[0].id,
        quantity: 2,
        note: `purchase of 2 ${ctx.businessB.business.offerings[0].title} by user ${ctx.businessA.business.ownerId}`,
      },
    })
    expect(orderResponse.createOrder.amount).toEqual('20')

    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('-20')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('20')
  })

  it('ensures an order from businessB for offeringA is rejected for insufficient funds', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessB.token}`)
    const orderResponse = ctx.client.request(createOrderMutation, {
      data: {
        offeringId: ctx.businessA.business.offerings[0].id,
        quantity: 1,
        note: `purchase of 1 ${ctx.businessA.business.offerings[0].title} by user ${ctx.businessB.business.ownerId}`,
      },
    })
    expect(async () => await orderResponse).rejects.toThrowError()

    // make sure no transactions are created
    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('-20')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('20')
  })

  it('ensures the previous order is refunded', async () => {
    ctx.client.setHeader('authorization', `Bearer ${ctx.businessB.token}`)
    const order = (await ctx.client.request(allOrdersQuery)).allOrders[0]
    expect(order.state).toEqual('PENDING')
    const refundedOrder = (
      await ctx.client.request(issueOrderRefundMutation, {
        id: order.id,
      })
    ).issueOrderRefund

    expect(refundedOrder.state).toEqual('REFUNDED')

    const balanceA = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessA.business.id,
    })
    expect(balanceA.businessBalance).toEqual('0')

    const balanceB = await ctx.client.request(businessBalanceQuery, {
      id: ctx.businessB.business.id,
    })
    expect(balanceB.businessBalance).toEqual('0')
  })
})
