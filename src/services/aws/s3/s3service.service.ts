import { PrismaClient } from '@prisma/client'
import AWS from 'aws-sdk'

import config from '../../../config'

export class S3Service {
  constructor(protected prisma: PrismaClient) {
    this.prisma = prisma
  }

  public async signS3(fileName: string) {
    const s3 = new AWS.S3({
      accessKeyId: config.AWS_ACCESS_KEY || '',
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY || '',
      region: config.AWS_REGION,
      signatureVersion: 'v4',
    })

    const s3Bucket = config.S3_BUCKET_NAME
    const s3Params = {
      Bucket: s3Bucket,
      Key: fileName,
      Expires: 60,
    }

    const url = await s3.getSignedUrl('putObject', s3Params)

    return {
      url,
    }
  }
}
