import { Auth, User } from '@prisma/client'
import { CreateUser } from './types'

export interface IUserRespository {
  create: (data: CreateUser) => Promise<void>
  findByEmail: (email: string) => Promise<Partial<Auth> | null>
  findUserById: (userId: string) => Promise<Partial<User> | null>
}
