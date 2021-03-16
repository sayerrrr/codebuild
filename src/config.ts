require('dotenv').config()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable required')
}
if (!process.env.POSTGRES_DEV) {
  throw new Error('POSTGRES_DEV environment variable required')
}
if (!process.env.AWS_ACCESS_KEY) {
  throw new Error('AWS_ACCESS_KEY environment variable required')
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_SECRET_ACCESS_KEY environment variable required')
}
if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION environment variable required')
}
if (!process.env.S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME environment variable required')
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET,
  SEGMENT_WRITE: process.env.SEGMENT_WRITE_DEV!,
  CUSTOMER_IO: {
    CIO_API_KEY: process.env.CIO_API_KEY!,
    CIO_SITE_ID: process.env.CIO_SITE_ID!,
    CIO_APP_API_KEY: process.env.CIO_APP_API_KEY!,
  },
  POSTGRES_DEV: process.env.POSTGRES_DEV,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
}

export interface Config {
  JWT_SECRET: string
  SEGMENT_WRITE: string
  CUSTOMER_IO: {
    CIO_API_KEY: string
    CIO_SITE_ID: string
    CIO_APP_API_KEY: string
  }
  POSTGRES_DEV: string
  AWS_ACCESS_KEY: string
  AWS_SECRET_ACCESS_KEY: string
  AWS_REGION: string
  S3_BUCKET_NAME: string
}

export default config
