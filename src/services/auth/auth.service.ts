import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { validate } from 'graphql'
import * as jwt from 'jsonwebtoken'

import config from '../../config'
import logger from '../../lib/logger'
import { PushService } from '../push/push.service'

export class AuthService {
  constructor(protected prisma: PrismaClient, protected push: PushService) {
    this.prisma = prisma
    this.push = push
  }

  private _signJWT = (id: string) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
      expiresIn: '1d',
    })
  }

  public isInviteCodeValid = async (code: string) => {
    if (!code) throw new Error('Code is required')

    const validCode = await this.prisma.inviteCode.findUnique({
      where: { code },
    })
    if (!validCode) return false

    return true
  }

  public registerUser = async (params: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    const email = params.email.toLowerCase()
    const exists = await this.prisma.user.findUnique({ where: { email } })

    if (exists) throw new Error('Email already in use')

    const hashed = await bcrypt.hash(params.password, 10)
    const validateEmailToken = crypto.randomBytes(64).toString('hex')
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName: params.firstName,
        lastName: params.lastName,
        role: 'USER',
        resetPasswordToken: '',
        resetPasswordExpiry: null,
        lastLogin: new Date(),
        validateEmailToken,
        isEmailValidated: false,
        isAdmin: false,
      },
    })

    await this.push.sendPushMessage({
      type: 'SegmentIdentify',
      payload: {
        userId: user.id,
        traits: {
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          email: user.email,
        },
      },
    })

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        userId: user.id,
        event: 'user_registered',
      },
    })

    const token = this._signJWT(user.id)

    return {
      user,
      token,
    }
  }

  public loginUser = async (params: { email: string; password: string }) => {
    const email = params.email.toLowerCase()
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('User does not exist')

    const validPassword = await bcrypt.compare(params.password, user.password)
    if (!validPassword) {
      throw new Error('Invalid password')
    }

    await this.push.sendPushMessage({
      type: 'SegmentTrack',
      payload: {
        event: 'logged_in',
        userId: user.id,
      },
    })

    const token = this._signJWT(user.id)

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return {
      user,
      token,
    }
  }

  public resetPassword = async (params: {
    email: string
    password: string
    confirmPassword: string
    resetPasswordToken: string
  }) => {
    if (!params.resetPasswordToken) {
      throw new Error('No password reset token')
    }
    if (params.confirmPassword !== params.password)
      throw new Error('Passwords do not match')

    const email = params.email.toLowerCase()
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) throw new Error('User does not exist')

    if (
      !user.resetPasswordToken ||
      user.resetPasswordToken !== params.resetPasswordToken
    )
      throw new Error('No password reset token')
    // TODO
    // if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date())
    //   throw new Error('Password reset token is invalid or expired')

    const hashed = await bcrypt.hash(params.password, 10)
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetPasswordToken: '',
        resetPasswordExpiry: null,
      },
    })

    const token = this._signJWT(user.id)

    return {
      user: updatedUser,
      token,
    }
  }

  public requestReset = async (params: { email: string }) => {
    const user = await this.prisma.user.findUnique({
      where: { email: params.email },
    })
    if (!user) throw new Error('User does not exist')

    const resetPasswordToken = crypto.randomBytes(64).toString('hex')
    const resetPasswordExpiry = new Date(Date.now() + 360000).toISOString()
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordExpiry,
      },
    })

    // TODO
    logger.info('Reset email sent')

    return updatedUser
  }
}
