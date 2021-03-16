import { PrismaClient } from '@prisma/client'

import { Config } from '../config'
import logger from '../lib/logger'
import { AuthService } from './auth/auth.service'
import { S3Service } from './aws/s3/s3service.service'
import { PushService } from './push/push.service'

export interface Services {
  config: Config
  auth: AuthService
  s3: S3Service
  push: PushService
}

export const buildServices = (
  prisma: PrismaClient,
  config: Config,
  push: PushService,
) => {
  try {
    const services = {
      config,
      auth: new AuthService(prisma, push),
      s3: new S3Service(prisma),
      push,
    }

    return services
  } catch (e) {
    logger.debug('Error instantiating services: ', e)
  }
}
