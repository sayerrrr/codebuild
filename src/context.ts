import { PrismaClient } from '@prisma/client'

import config from './config'
import { BusinessService } from './models/business'
import { CategoryService } from './models/category'
import { OfferingService } from './models/offering'
import { OrderService } from './models/order'
import { TransactionService } from './models/transaction'
import { UserService } from './models/user'
import { PushService } from './services/push/push.service'
import { buildServices, Services } from './services/services'

export type Context = {
  req: any
  services: Services
  user: UserService
  business: BusinessService
  transaction: TransactionService
  offering: OfferingService
  category: CategoryService
  order: OrderService
}

const { CUSTOMER_IO, SEGMENT_WRITE } = config
const push = new PushService(
  SEGMENT_WRITE,
  CUSTOMER_IO.CIO_SITE_ID,
  CUSTOMER_IO.CIO_API_KEY,
)

export const buildContext = (req: any, prisma: PrismaClient) => {
  return {
    ...req,
    services: buildServices(prisma, config, push),
    user: new UserService(prisma, push),
    business: new BusinessService(prisma, push),
    transaction: new TransactionService(prisma, push),
    offering: new OfferingService(prisma, push),
    category: new CategoryService(prisma),
    order: new OrderService(prisma, push),
  }
}
