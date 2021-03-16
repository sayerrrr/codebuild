import { rule, shield } from 'graphql-shield'
import * as jwt from 'jsonwebtoken'

import config from '../../../config'
import logger from '../../../lib/logger'

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const id = isAuthenticatedUser(context)
    return Boolean(id)
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
  },
})

export const isAuthenticatedUser = (headers: { authorization: string }) => {
  const { authorization } = headers
  const token = authorization.replace('Bearer ', '')
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    if (!decoded) throw new Error('Not authenticated')
    const id = (decoded as Decoded).id
    return { authenticated: true, id }
  } catch (e) {
    logger.error(e)
    return { authenticated: false, id: null }
  }
}

export interface Decoded {
  id: string
  exp: number
}
