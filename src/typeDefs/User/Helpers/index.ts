import { enumType, inputObjectType } from 'nexus'
export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  definition: (t) => {
    t.list.field('AND', { type: 'UserWhereInput' })
    t.list.field('NOT', { type: 'UserWhereInput' })
    t.list.field('OR', { type: 'UserWhereInput' })
    t.field('business', { type: 'BusinessListRelationFilter' })
    t.field('createdAt', { type: 'DateTimeFilter' })
    t.field('email', { type: 'StringFilter' })
    t.field('id', { type: 'StringFilter' })
    t.field('isAdmin', { type: 'BoolFilter' })
    t.field('isDisabled', { type: 'BoolFilter' })
    t.field('isEmailValidated', { type: 'BoolFilter' })
    t.field('lastLogin', { type: 'DateTimeFilter' })
    t.field('lastName', { type: 'StringFilter' })
    t.field('firstName', { type: 'StringFilter' })
    t.field('password', { type: 'StringFilter' })
    t.field('role', { type: 'EnumRoleFilter' })
    t.field('updatedAt', { type: 'DateTimeFilter' })
  },
})

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  definition: (t) => {
    t.string('email')
    t.string('id')
  },
})

export const UserUpdateManyMutationInput = inputObjectType({
  name: 'UserUpdateManyMutationInput',
  definition: (t) => {
    t.field('isAdmin', { type: 'BoolUpdateInput' })
    t.field('isDisabled', { type: 'BoolUpdateInput' })
    t.field('lastLogin', { type: 'DateTimeUpdateInput' })
    t.field('role', { type: 'EnumRoleFieldUpdateOperationsInput' })
  },
})

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition: (t) => {
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('lastName')
    t.nonNull.string('firstName')
  },
})

export const UserUpdateInput = inputObjectType({
  name: 'UserUpdateInput',
  definition: (t) => {
    t.string('avatarUrl')
    t.field('dateResetPasswordRequest', { type: 'DateTime' })
    t.string('email')
    t.string('handle')
    t.boolean('isEmailValidated')
    t.field('lastLogin', { type: 'DateTime' })
    t.string('firstName')
    t.string('lastName')
    t.string('password')
    t.string('resetPasswordToken')
    t.field('role', { type: 'Role' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const Role = enumType({
  name: 'Role',
  members: ['ADMIN', 'USER'],
})

export const AttachCategoriesInput = inputObjectType({
  name: 'AttachCategoriesInput',
  definition: (t) => {
    t.nonNull.list.field('requestedCategories', { type: 'String' })
  },
})
