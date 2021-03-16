import { intArg, inputObjectType, core, enumType } from 'nexus'

/**
 * REFERENCE:
 * https://www.prisma.io/docs/concepts/components/prisma-client/pagination
 */

export declare type PaginationArgs = {
  id?: string | null
  first?: number | null
  last?: number | null
  skip?: number | null
}

export const offsetToPrismaPagination = (
  args: PaginationArgs,
): { take?: number; skip?: number } => {
  const { first, last, skip } = args

  // If no pagination set, don't touch the args
  if (!first && !skip) {
    return {}
  }

  if (first && last) {
    throw new Error('first and last cannot be set simultaneously')
  }

  const take = resolveTake(first, last)

  const newArgs = {
    take,
    skip: skip ?? undefined,
  }

  return newArgs
}

export const paginationArgs = {
  first: intArg(),
  skip: intArg(),
}

export const OrderByEnum = enumType({
  name: 'OrderBy',
  members: ['asc', 'desc'],
})

export function buildOrderBy<M extends keyof core.GetGen<'rootTypes'>>(
  model: M,
  fields: Array<keyof core.GetGen<'rootTypes'>[M]>,
) {
  return inputObjectType({
    name: `${model}OrderBy`,
    definition(t) {
      for (const f of fields) {
        t.field(f as string, { type: OrderByEnum })
      }
    },
  })
}

const resolveTake = (
  first: number | null | undefined,
  last: number | null | undefined,
): number | undefined => {
  if (first && last) {
    throw new Error('first and last cannot be set simultaneously')
  }

  if (first) {
    if (first < 0) {
      throw new Error('first cannot be negative')
    }
    return first
  }

  if (last) {
    if (last < 0) {
      throw new Error('last cannot be negative')
    }

    if (last === 0) {
      return 0
    }

    return last * -1
  }

  return undefined
}

const resolveCursor = (
  before: string | null | undefined,
  after: string | null | undefined,
) => {
  if (before && after) {
    throw new Error('before and after cannot be set simultaneously')
  }

  if (before) {
    return { id: before }
  }

  if (after) {
    return { id: after }
  }

  return undefined
}

const resolveSkip = (cursor: { id: string } | null | undefined) => {
  if (cursor) {
    return 1
  }

  return undefined
}
