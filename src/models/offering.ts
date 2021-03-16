import { PrismaClient } from '@prisma/client'
import { PushService } from '../services/push/push.service'

export class OfferingService {
  private prisma
  private push

  constructor(prisma: PrismaClient, push: PushService) {
    this.prisma = prisma
    this.push = push
  }

  public findOneById = async (params: { id: string; include?: any }) => {
    const offering = await this.prisma.offering.findUnique({
      where: { id: params.id },
      include: params.include,
    })
    if (!offering) {
      throw new Error('Could not find offering with id: ' + params.id)
    }
    return offering
  }

  public findMany = async (params: { where?; skip?; take? }) => {
    const { where, skip, take } = params
    return this.prisma.offering.findMany({
      where: where || undefined,
      skip: skip || undefined,
      take: take || undefined,
    })
  }

  public updateOffering = async (params: { data: any; id: string }) => {
    const exists = await this.findOneById({ id: params.id })
    if (!exists) throw new Error('Offering does not exist')

    const updatedOffering = await this.prisma.offering.update({
      where: {
        id: params.id,
      },
      data: params.data,
    })

    if (!updatedOffering)
      throw new Error('Could not update offering at this time')

    return updatedOffering
  }

  public createOffering = async (params: { data: any }) => {
    const { businessId } = params.data
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    })
    if (!business) throw new Error('Business does not exist')

    const categoryId = params.data.categoryId
    delete params.data.categoryId
    const offering = await this.prisma.offering.create({ data: params.data })

    // create category if an id is present
    if (categoryId) {
      await this.prisma.offering.update({
        where: {
          id: offering.id,
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
    }

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'offering_created',
        userId: business.ownerId,
        properties: {
          offeringId: offering.id,
          businessId: offering.businessId,
          cost: offering.cost,
        },
      },
    })

    return offering
  }

  public disableOffering = async (params: { id: string }) => {
    const { id, business } = await this.findOneById({
      id: params.id,
      include: { business: true },
    })
    if (!id) throw new Error('Offering does not exist')

    const offering = await this.updateOffering({
      data: { isDisable: true },
      id,
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'offering_deleted',
        userId: business.ownerId,
        properties: {
          offeringId: id,
          businessId: business.id,
          cost: offering.cost,
        },
      },
    })

    return offering
  }

  public countAllOffering = async (params: { where? }) => {
    return await this.prisma.offering.count({
      where: params.where || undefined,
    })
  }
}
