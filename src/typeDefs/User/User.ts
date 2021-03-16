import { objectType, idArg } from 'nexus'

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.nonNull.string('id')
    t.nonNull.string('email')
    t.string('lastName')
    t.string('firstName')
    t.nonNull.string('password')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('role', { type: 'Role' })
    t.string('avatarUrl')
    t.field('lastLogin', { type: 'DateTime' })
    t.string('resetPasswordToken')
    t.field('resetPasswordExpiry', { type: 'DateTime' })
    t.nonNull.string('validateEmailToken')
    t.nonNull.boolean('isEmailValidated')
    t.list.field('business', {
      type: 'Business',
      resolve: async (parent, {}, ctx) => {
        return await ctx.business.findByOwner({ id: parent.id })
      },
    })
    t.list.string('requestedCategories')
    t.nonNull.boolean('isAdmin')
    t.nonNull.boolean('isDisabled')
  },
})
