import { PrismaClient } from '@prisma/client'
import { PushService } from '../services/push/push.service'

export class TransactionService {
  private push
  private prisma

  constructor(prisma: PrismaClient, push: PushService) {
    this.prisma = prisma
    this.push = push
  }

  public findOneById = async (params: { id: string }) => {
    return (
      (await this.prisma.transaction.findUnique({
        where: { id: params.id },
      })) || null
    )
  }

  public findManyTransaction = async (params: { where; take; skip }) => {
    const { where, take, skip } = params
    return await this.prisma.transaction.findMany({
      where: where || undefined,
      take: take || undefined,
      skip: skip || undefined,
    })
  }

  public findAllByBusiness = async (params: {
    id: string
    take?: number | null
    skip?: number | null
  }) => {
    if (!params.id) throw new Error('Business ID is required')
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: params.id || undefined },
          { recipientId: params.id || undefined },
        ],
      },
      take: params.take || undefined,
      skip: params.skip || undefined,
    })
  }

  public createTransaction = async (params: {
    data: any
    senderBalance: any
    senderBusiness: any
  }) => {
    const { recipientId, senderId, amount } = params.data
    const { senderBalance, senderBusiness } = params

    if (!recipientId || !senderId || !amount)
      throw new Error('Recipient, sender, and amount are required')

    if (amount <= 0) {
      throw new Error('Amount must be above 0')
    }

    if (senderBalance - amount < -Math.abs(senderBusiness.creditAmount)) {
      throw new Error('Insufficent funds')
    }

    const data = {
      recipientId,
      senderId,
      amount,
    }

    const tx = await this.prisma.transaction.create({
      data,
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'transaction_created_recipient',
        userId: recipientId,
        properties: {
          id: tx.id,
          amount: amount,
          senderId: senderId,
        },
      },
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'transaction_created_sender',
        userId: senderId,
        properties: {
          id: tx.id,
          amount: amount,
          senderId: recipientId,
        },
      },
    })

    return tx
  }

  public countAllTransactions = async (params: { where? }) => {
    return await this.prisma.transaction.count({
      where: params.where || undefined,
    })
  }
}
