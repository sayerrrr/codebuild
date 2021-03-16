import { arg, extendType, nonNull, stringArg } from 'nexus'

export const AuthMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('registerUser', {
      type: 'AuthPayload',
      args: {
        data: arg({ type: nonNull('UserCreateInput') }),
      },
      resolve: async (_parent, { data }, ctx) => {
        const { email, password, firstName, lastName } = data
        return await ctx.services.auth.registerUser({
          email,
          password,
          firstName,
          lastName,
        })
      },
    })

    t.nonNull.field('loginUser', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        return await ctx.services.auth.loginUser({
          email,
          password,
        })
      },
    })

    t.field('requestReset', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_parent, { email }, ctx) => {
        return await ctx.services.auth.requestReset({ email })
      },
    })

    t.nonNull.field('resetPassword', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        confirmPassword: nonNull(stringArg()),
        resetPasswordToken: nonNull(stringArg()),
      },
      resolve: async (
        _parent,
        { email, password, confirmPassword, resetPasswordToken },
        ctx,
      ) => {
        return await ctx.services.auth.resetPassword({
          email,
          password,
          confirmPassword,
          resetPasswordToken,
        })
      },
    })
  },
})
