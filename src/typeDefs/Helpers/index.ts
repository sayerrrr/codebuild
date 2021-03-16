import { Prisma } from '@prisma/client'
import { Kind } from 'graphql'
import { inputObjectType, objectType, scalarType } from 'nexus'

export const StringFilter = inputObjectType({
  name: 'StringFilter',
  definition: (t) => {
    t.string('contains')
    t.string('endsWith')
    t.string('equals')
    t.string('gt')
    t.string('gte')
    t.list.string('in')
    t.string('lt')
    t.string('lte')
    t.field('not', { type: NestedStringFilter })
    t.list.string('notIn')
    t.string('startsWith')
  },
})

export const NestedStringFilter = inputObjectType({
  name: 'NestedStringFilter',
  definition: (t) => {
    t.string('contains')
    t.string('endsWith')
    t.string('equals')
    t.string('gt')
    t.string('gte')
    t.list.string('in')
    t.string('lt')
    t.string('lte')
    t.field('not', { type: 'NestedStringFilter' })
    t.list.string('notIn')
    t.string('startsWith')
  },
})

export const BatchCount = objectType({
  name: 'BatchCount',
  definition: (t) => {
    t.nonNull.int('count')
  },
})

export const BoolFilter = inputObjectType({
  name: 'BoolFilter',
  definition: (t) => {
    t.boolean('equals')
    t.field('not', { type: 'NestedBoolFilter' })
  },
})

export const NestedBoolFilter = inputObjectType({
  name: 'NestedBoolFilter',
  definition: (t) => {
    t.boolean('equals')
    t.field('not', { type: 'NestedBoolFilter' })
  },
})

export const DateTime = scalarType({
  name: 'DateTime',
  serialize(time) {
    return time
  },
  parseValue(time) {
    return time
  },
  parseLiteral(time) {
    return time
  },
})

export const DateTimeFilter = inputObjectType({
  name: 'DateTimeFilter',
  definition: (t) => {
    t.field('equals', { type: 'DateTime' })
    t.field('gt', { type: 'DateTime' })
    t.field('gte', { type: 'DateTime' })
    t.list.field('in', { type: 'DateTime' })
    t.field('lt', { type: 'DateTime' })
    t.field('lte', { type: 'DateTime' })
    t.list.field('notIn', { type: 'DateTime' })
  },
})

export const NestedDateTimeFilter = inputObjectType({
  name: 'NestedDateTimeFilter',
  definition: (t) => {
    t.field('equals', { type: 'DateTime' })
    t.field('gt', { type: 'DateTime' })
    t.field('gte', { type: 'DateTime' })
    t.list.field('in', { type: 'DateTime' })
    t.field('lt', { type: 'DateTime' })
    t.field('lte', { type: 'DateTime' })
    t.field('not', { type: 'DateTimeFilter' })
    t.list.field('notIn', { type: 'DateTime' })
  },
})

export const IntFilter = inputObjectType({
  name: 'IntFilter',
  definition: (t) => {
    t.int('equals')
    t.int('gt')
    t.int('gte')
    t.list.int('in')
    t.int('lt')
    t.int('lte')
    t.field('not', { type: 'NestedIntFilter' })
    t.list.int('notIn')
  },
})

export const NestedIntFilter = inputObjectType({
  name: 'NestedIntFilter',
  definition: (t) => {
    t.int('equals')
    t.int('gt')
    t.int('gte')
    t.list.int('in')
    t.int('lt')
    t.int('lte')
    t.field('not', { type: 'NestedIntFilter' })
    t.list.int('notIn')
  },
})

export const BoolUpdateInput = inputObjectType({
  name: 'BoolUpdateInput',
  definition: (t) => {
    t.boolean('set')
  },
})

export const IntUpdateInput = inputObjectType({
  name: 'IntUpdateInput',
  definition: (t) => {
    t.int('decrement')
    t.int('divide')
    t.int('increment')
    t.int('multiply')
    t.int('set')
  },
})

export const Decimal = scalarType({
  name: 'Decimal',
  description: 'Decimal custom scalar type',
  serialize(decimalValue) {
    return decimalValue.toString()
  },
  parseValue(value) {
    return new Prisma.Decimal(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Prisma.Decimal(ast.value)
    }
    return null
  },
})

export const DecimalFilter = inputObjectType({
  name: 'DecimalFilter',
  definition: (t) => {
    t.field('equals', { type: 'Decimal' })
    t.field('gt', { type: 'Decimal' })
    t.field('gte', { type: 'Decimal' })
    t.list.field('in', { type: 'Decimal' })
    t.field('lt', { type: 'Decimal' })
    t.field('lte', { type: 'Decimal' })
    t.field('not', { type: 'NestedDecimalFilter' })
    t.list.field('notIn', { type: 'Decimal' })
  },
})

export const NestedDecimalFilter = inputObjectType({
  name: 'NestedDecimalFilter',
  definition: (t) => {
    t.field('equals', { type: 'Decimal' })
    t.field('gt', { type: 'Decimal' })
    t.field('gte', { type: 'Decimal' })
    t.list.field('in', { type: 'Decimal' })
    t.field('lt', { type: 'Decimal' })
    t.field('lte', { type: 'Decimal' })
    t.field('not', { type: 'NestedDecimalFilter' })
    t.list.field('notIn', { type: 'Decimal' })
  },
})

export const EnumRoleFilter = inputObjectType({
  name: 'EnumRoleFilter',
  definition: (t) => {
    t.field('equals', { type: 'Role' })
    t.list.field('in', { type: 'Role' })
    t.field('not', { type: 'NestedEnumRoleFilter' })
    t.list.field('notIn', { type: 'Role' })
  },
})

export const NestedEnumRoleFilter = inputObjectType({
  name: 'NestedEnumRoleFilter',
  definition: (t) => {
    t.field('equals', { type: 'Role' })
    t.list.field('in', { type: 'Role' })
    t.list.field('notIn', { type: 'Role' })
  },
})

export const OrderStateFilter = inputObjectType({
  name: 'OrderStateFilter',
  definition(t) {
    t.field('equals', { type: 'OrderState' })
  },
})

export const DateTimeUpdateInput = inputObjectType({
  name: 'DateTimeUpdateInput',
  definition: (t) => {
    t.field('set', { type: 'DateTime' })
  },
})

export const EnumRoleFieldUpdateOperationsInput = inputObjectType({
  name: 'EnumRoleFieldUpdateOperationsInput',
  definition: (t) => {
    t.field('set', { type: 'Role' })
  },
})

export const EnumStateFieldUpdateOperationsInput = inputObjectType({
  name: 'EnumStateFieldUpdateOperationsInput',
  definition: (t) => {
    t.field('set', { type: 'OrderState' })
  },
})
