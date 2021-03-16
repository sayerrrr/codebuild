import { PrismaClient } from '@prisma/client'

export class CategoryService {
  constructor(protected prisma: PrismaClient) {
    this.prisma = prisma
  }

  public findByOffering = async (params: { id: string }) => {
    const offering = await this.prisma.offering.findUnique({
      where: { id: params.id },
      include: { categories: true },
    })

    return offering?.categories || null
  }

  public findByUser = async (params: { id: string }) => {
    const user = await this.prisma.user.findUnique({
      where: { id: params.id },
    })
    return user?.requestedCategories || null
  }

  public findOneCategory = async (params: { id: string }) => {
    return await this.prisma.offeringCategory.findUnique({
      where: { id: params.id },
    })
  }

  public findManyCategories = async (params: { where; take; skip }) => {
    const { where, take, skip } = params
    return await this.prisma.offeringCategory.findMany({
      where: where || undefined,
      take: take || undefined,
      skip: skip || undefined,
    })
  }

  public createCategory = async (params: { data: any }) => {
    return await this.prisma.offeringCategory.create({
      data: {
        category: params.data.category,
      },
    })
  }

  public deleteCategory = async (params: { id: any }) => {
    return this.prisma.offeringCategory.delete({
      where: { id: params.id },
    })
  }

  public deleteManyCategory = async (params: { where: any }) => {
    return await this.prisma.offeringCategory.deleteMany({
      where: params.where,
    })
  }

  public updateOneCategory = async (params: { id: string; data: any }) => {
    return this.prisma.offeringCategory.update({
      where: { id: params.id },
      data: params.data,
    })
  }

  public updateManyCategory = async (params: { where: any; data: any }) => {
    return this.prisma.offeringCategory.updateMany({
      where: params.where,
      data: params.data,
    })
  }

  public countAllCategory = async (params: { where? }) => {
    return await this.prisma.offeringCategory.count({
      where: params.where || undefined,
    })
  }
}
