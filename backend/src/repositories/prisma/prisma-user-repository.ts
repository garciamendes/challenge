import { prisma } from '../../lib/prisma'
import { CreateUser } from '../types'
import { IUserRespository } from '../user-repository'

export class UserRepositoryPrisma implements IUserRespository {
  async create(data: CreateUser) {
    await prisma.auth.create({
      data: {
        email: data.email,
        password: data.password,
        user: {
          create: {
            name: data.email,
          },
        },
      },
    })
  }

  async findByEmail(email: string) {
    const user = await prisma.auth.findUnique({
      where: { email },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            modifiedAt: true,
          },
        },
      },
      omit: {
        password: true,
        userId: true,
      },
    })

    if (!user) return null

    return user
  }

  async findUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        id: true,
        createdAt: true,
        modifiedAt: true,
        auth: {
          omit: {
            password: true,
            userId: true,
          },
        },
      },
    })

    if (!user) return null

    return user
  }
}
