import { PrismaClient, User, Prisma } from '@prisma/client'
import { PushService } from '../services/push/push.service'

export type AuthPayload = {
  user: User | null
  token: string | null
}
export class UserService {
  private push
  private prisma

  constructor(prisma: PrismaClient, push: PushService) {
    this.prisma = prisma
    this.push = push
  }

  public findOneById = async (params: { id: string }) => {
    return (
      (await this.prisma.user.findUnique({
        where: { id: params.id },
      })) || null
    )
  }

  public findOneByEmail = async (params: { email: string }) => {
    const { email } = params
    return (
      (await this.prisma.user.findUnique({
        where: { email },
      })) || null
    )
  }

  public findMany = async (params: { where; skip; take }) => {
    const { where, skip, take } = params
    return this.prisma.user.findMany({
      where: where || undefined,
      skip: skip || undefined,
      take: take || undefined,
    })
  }

  public updateUser = async (params: {
    data: any
    id: string
  }): Promise<User> => {
    const exists = await this.findOneById({ id: params.id })
    if (!exists) throw new Error('User does not exist')

    const updatedUser = await this.prisma.user.update({
      where: {
        id: params.id,
      },
      data: params.data,
    })

    if (!updatedUser) throw new Error('Could not update user at this time')

    return updatedUser
  }
  // TODO
  public updateManyUser = async (params: { data: any; where: any }) => {
    const { data, where } = params
    if (!data || !where)
      throw new Error('Batch update requires both data & where arguments')
    return await this.prisma.user.updateMany({ where, data })
  }

  public disableUser = async (params: { id: string }) => {
    const exists = await this.findOneById({ id: params.id })
    if (!exists) throw new Error('User does not exist')

    const user = await this.updateUser({
      data: { isDisabled: true },
      id: params.id,
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'user_deleted',
        userId: user.id,
      },
    })
    return user
  }

  public isEmailUnique = async (email: string) => {
    const unique = await this.prisma.user.findFirst({ where: { email } })

    return unique ? false : true
  }

  public countAllUsers = async (params: { where? }) => {
    return await this.prisma.user.count({ where: params.where || undefined })
  }
}
