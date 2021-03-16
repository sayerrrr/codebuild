import { PrismaClient } from '@prisma/client'
import { PushService } from '../services/push/push.service'
import { Transaction, Offering } from '../lib/types'

export class OrderService {
  private prisma
  private push

  constructor(prisma: PrismaClient, push: PushService) {
    this.prisma = prisma
    this.push = push
  }

  public findOneById = async (params: { id: string; include?: any }) => {
    return await this.prisma.order.findUnique({
      where: { id: params.id },
      include: params.include,
    })
  }

  public findManyOrder = async (params: { where; skip; take }) => {
    const { where, skip, take } = params
    return this.prisma.order.findMany({
      where: where || undefined,
      skip: skip || undefined,
      take: take || undefined,
    })
  }

  public updateOneOrder = async (params: { data: any; id: string }) => {
    const exists = await this.findOneById({ id: params.id })
    if (!exists) throw new Error('Order does not exist')

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: params.id,
      },
      data: params.data,
    })
    return updatedOrder
  }

  public updateManyOrder = async (params: { data: any; where: any }) => {
    const { data, where } = params
    const updateOrder = await this.prisma.order.updateMany({
      where,
      data,
    })

    if (!updateOrder) throw new Error('Error updating order')

    return updateOrder
  }

  public createOrder = async (params: {
    data: any
    transaction: Transaction
    offering: Offering
  }) => {
    const userId = params.offering.business.ownerId
    const totalCost = params.data.quantity * (params.offering.cost || 0)

    const order = await this.prisma.order.create({
      data: {
        offeringId: params.data.offeringId,
        transactionId: params.transaction.id,
        quantity: params.data.quantity,
        amount: totalCost,
        note: params.data.note,
        state: params.data.state,
      },
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'order_created',
        userId: userId,
        properties: {
          orderId: order.id,
        },
      },
    })
    return order
  }

  public issueRefund = async (params: { id: string }) => {
    const { id: orderId, transaction, Offering } = await this.findOneById({
      id: params.id,
      include: { transaction: true, Offering: { include: { business: true } } },
    })

    if (!orderId) throw new Error('Order does not exist')

    const { recipientId, senderId, amount } = transaction
    const { id } = Offering
    const { ownerId } = Offering.business

    const data = {
      recipientId: senderId,
      senderId: recipientId,
      amount: amount,
      offeringId: id,
    }

    const reversedTx = await this.prisma.transaction.create({
      data,
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        userId: ownerId,
        properties: {
          orderId: orderId,
          transactionId: reversedTx.id,
        },
      },
    })

    return await this.updateOneOrder({
      data: { state: 'REFUNDED' },
      id: params.id,
    })
  }

  public countAllOrders = async (params: { where? }) => {
    return await this.prisma.order.count({
      where: params.where || undefined,
    })
  }
}
