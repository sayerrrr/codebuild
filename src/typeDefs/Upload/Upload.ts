import { extendType, nonNull, objectType, stringArg } from 'nexus'

export const UploadedFileResponse = objectType({
  name: 'S3SignedPath',
  definition: (t) => {
    t.nonNull.string('url')
  },
})

export const UploadMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('signS3', {
      type: 'S3SignedPath',
      args: {
        fileName: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const { fileName } = args
        return await ctx.services.s3.signS3(fileName)
      },
    })
  },
})
