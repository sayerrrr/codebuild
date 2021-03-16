export interface User {
  id: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  role: Role
  avatarUrl?: string
  lastLogin?: Date
  resetPasswordToken: string
  resetPasswordExpiry?: Date
  validateEmailToken: string
  isEmailValidated: boolean
  business?: Business[]
  requestedCategories?: OfferingCategory[]
  isAdmin: boolean
  isDisabled: boolean
}

export interface Transaction {
  id: string
  recipient: Business
  recipientId: string
  sender: Business
  senderId: string
  amount: undefined
  createdAt: Date
  offering: Offering
  offeringId: string
}

export interface Business {
  id: string
  description?: string
  createdAt: Date
  updatedAt: Date
  ownerId: string
  owner: User
  address?: string
  name: string
  tagline?: string
  offerings?: Offering[]
  logoUrl?: string
  coverUrl?: string
  socialLinks?: string[]
  externalLinks?: string[]
  phoneNumber?: string
  creditAmount: number
  creditScore: number
  approved: boolean
  handle: string
  isDisabled: boolean
  recipient?: Transaction[]
  sender?: Transaction[]
}

export interface Offering {
  id: string
  createdAt: Date
  updatedAt: Date
  business: Business
  businessId: string
  cost: undefined
  address?: string
  imageUrl?: string
  videoUrl?: string
  description?: string
  title?: string
  isDisabled: boolean
  categories?: OfferingCategory[]
}

export interface OfferingCategory {
  id: string
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: String
  createdAt: Date
  updatedAt: Date
  Offering: Offering
  offeringId: String
  transactionId: String
  Transaction: Transaction
  quantity: number
  amount: undefined
  note: String
  state: OrderState
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum OrderState {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PENDING = 'PENDING',
}
