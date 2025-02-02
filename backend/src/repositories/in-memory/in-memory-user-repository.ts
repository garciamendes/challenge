import { randomUUID } from 'node:crypto'
import { Auth, User } from '@prisma/client'
import { IUserRespository } from '../user-repository'
import { CreateUser } from '../types'

export class UserRepositoryInMemory implements IUserRespository {
  public userItems: User[] = []
  public authUser: Auth[] = []

  async create(data: CreateUser) {
    const user: User = {
      id: randomUUID(),
      name: data.email,
      createdAt: new Date(),
      modifiedAt: new Date(),
    }

    const auth: Auth = {
      id: randomUUID(),
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      modifiedAt: new Date(),
      userId: user.id,
    }

    this.userItems.push(user)
    this.authUser.push(auth)
  }

  async findByEmail(email: string) {
    const auth = this.authUser.find((auth) => auth.email === email)
    if (!auth) return null

    const user = this.userItems.find((user) => user.id === auth?.userId)

    return user as User
  }

  async findUserById(userId: string) {
    const user = this.userItems.find((user) => user.id === userId)

    if (!user) return null

    return user
  }
}
