import { hash } from 'bcryptjs'
import { CreateUser } from '../../repositories/types'
import { IUserRespository } from '../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { env } from '../../env'

export class CreateUserUseCase {
  constructor(private userRepository: IUserRespository) {}

  async execute(data: CreateUser) {
    const hasUser = Boolean(await this.userRepository.findByEmail(data.email))

    if (hasUser) throw new UserAlreadyExistsError()

    const passwordHash = await hash(data.password, env.SALT_HASH)
    await this.userRepository.create({
      email: data.email,
      password: passwordHash,
    })
  }
}
