import { Offering, PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'

import logger from '../lib/logger'
import { PushService } from '../services/push/push.service'

export class BusinessService {
  private prisma
  private push

  constructor(prisma: PrismaClient, push: PushService) {
    this.prisma = prisma
    this.push = push
  }

  public findOneById = async (params: { id: string; include?: any }) => {
    return await this.prisma.business.findUnique({
      where: { id: params.id },
      include: params.include,
    })
  }

  public findOneByHandle = async (params: { handle: string }) => {
    return await this.prisma.business.findUnique({
      where: { handle: params.handle },
    })
  }

  public findByOwner = async (params: { id: string }) => {
    return (
      (await this.prisma.business.findMany({
        where: { ownerId: params.id },
      })) || null
    )
  }

  public findMany = async (params: { where; skip; take }) => {
    const { where, skip, take } = params
    return this.prisma.business.findMany({
      where: where || undefined,
      skip: skip || undefined,
      take: take || undefined,
    })
  }

  public updateOneBusiness = async (params: { data: any; id: string }) => {
    const exists = await this.findOneById({ id: params.id })
    if (!exists) throw new Error('Business does not exist')

    const updatedBusiness = await this.prisma.business.update({
      where: {
        id: params.id,
      },
      data: params.data,
    })

    return updatedBusiness
  }

  public updateManyBusiness = async (params: { data: any; where: any }) => {
    const { data, where } = params
    const updatedBusiness = await this.prisma.business.updateMany({
      where,
      data,
    })

    if (!updatedBusiness) throw new Error('Error updating businesses')

    return updatedBusiness
  }

  public isHandleUnique = async (handle: string) => {
    const exists =
      (await this.prisma.business.findFirst({
        where: {
          handle,
        },
      })) || null

    return exists ? false : true
  }

  public createBusiness = async (params: { data: any }) => {
    const { handle, ownerId } = params.data
    if (!handle || !ownerId) throw new Error('Handle or OwnerId missing')

    const unique = await this.isHandleUnique(handle)
    if (!unique) throw new Error('Handle already in use')

    const business = await this.prisma.business.create({
      data: {
        description: params.data.description || '',
        address: params.data.address || '',
        tagline: params.data.tagline || '',
        name: params.data.name,
        logoUrl: params.data.logoUrl || '',
        coverUrl: params.data.coverUrl || '',
        socialLinks: params.data.socialLinks || '',
        externalLinks: params.data.externalLinks || '',
        phoneNumber: params.data.phoneNumber || '',
        email: params.data.email || '',
        creditAmount: params.data.creditAmount || 0,
        creditScore: params.data.creditScore || 0,
        approved: params.data.approved,
        handle,
        ownerId,
      },
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'business_created',
        userId: business.ownerId,
        properties: {
          name: business.name,
          handle: business.handle,
          businessId: business.id,
          phoneNumber: business.phoneNumber || '',
          location: business.address || '',
        },
      },
    })

    return business
  }

  public createBusinessWithOfferings = async (params: { data: any }) => {
    const { handle, ownerId } = params.data.business
    if (!handle || !ownerId) throw new Error('Handle or OwnerId missing')

    const unique = await this.isHandleUnique(handle)
    if (!unique) throw new Error('Handle already in use')

    const business = await this.prisma.business.create({
      data: {
        description: params.data.business.description || '',
        address: params.data.business.address || '',
        logoUrl: params.data.business.logoUrl || '',
        coverUrl: params.data.business.coverUrl || '',
        name: params.data.business.name,
        tagline: params.data.business.tagline || '',
        socialLinks: params.data.business.socialLinks || '',
        externalLinks: params.data.business.externalLinks || '',
        phoneNumber: params.data.business.phoneNumber || '',
        email: params.data.email || '',
        creditAmount: params.data.business.creditAmount || 0,
        creditScore: params.data.business.creditScore || 0,
        approved: params.data.business.approved,
        handle,
        ownerId,
      },
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'business_created',
        userId: business.ownerId,
        properties: {
          handle: business.handle,
          name: business.name,
          businessId: business.id,
          phoneNumber: business.phoneNumber || '',
          location: business.address || '',
        },
      },
    })

    try {
      params.data.offerings.map(async (offering: any) => {
        const categoryId = offering.categoryId
        delete offering.categoryId
        const offer = await this.prisma.offering.create({
          data: {
            ...offering,
            businessId: business.id,
          },
        })

        if (categoryId)
          await this.prisma.offering.update({
            where: {
              id: offer.id,
            },
            data: {
              categories: {
                connect: [
                  {
                    id: categoryId,
                  },
                ],
              },
            },
          })

        await this.push.sendPushMessage({
          type: 'SegmentTrack',
          payload: {
            userId: business.ownerId,
            event: 'offering_created',
            properties: {
              offeringId: offer.id,
              businessId: offer.businessId,
              cost: offer.cost,
            },
          },
        })
        return offer
      })
    } catch (e) {
      logger.error(e)
    }

    return business
  }

  public disableBusiness = async (params: { id: string }) => {
    const { id, owner } = await this.findOneById({
      id: params.id,
      include: { owner: true },
    })

    if (!id) throw new Error('Business does not exist')

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'business_deleted',
        userId: owner.id,
        properties: {
          businessId: id,
        },
      },
    })

    return await this.updateOneBusiness({
      data: { isDisable: true },
      id: params.id,
    })
  }

  public getBusinessBalance = async (params: { id: string }) => {
    const sentTransactions = await this.prisma.transaction.findMany({
      where: { senderId: params.id },
    })

    const receivedTransactions = await this.prisma.transaction.findMany({
      where: { recipientId: params.id },
    })

    const totalSent = sentTransactions.reduce(function (result, item) {
      return result.plus(item.amount)
    }, new Decimal(0))

    const totalReceived = receivedTransactions.reduce(function (result, item) {
      return result.plus(item.amount)
    }, new Decimal(0))

    return totalReceived.minus(totalSent)
  }

  public countAllBusiness = async (params: { where? }) => {
    return await this.prisma.business.count({
      where: params.where || undefined,
    })
  }
}
