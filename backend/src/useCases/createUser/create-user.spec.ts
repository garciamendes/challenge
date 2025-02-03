import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { CreateUserUseCase } from '.'
import { UserRepositoryInMemory } from '../../repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'

let userRepository: UserRepositoryInMemory
let sut: CreateUserUseCase

describe('Register Use Case', () => {
  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory()
    sut = new CreateUserUseCase(userRepository)
  })

  it('Should be possible to create a new user', async () => {
    const email = 'teste@gmail.com'
    const password = 'dev123'
    await sut.execute({ email, password })
    const newUser = userRepository.userItems.find((user) => user.name === email)
    const authUser = userRepository.authUser.find(
      (auth) => auth.email === email
    )

    expect(userRepository.userItems.length).toEqual(1)
    expect(newUser?.name).toEqual(email)
    expect(authUser?.email).toEqual(email)
    const passwordHashPassed = await compare(password, authUser?.password!)
    expect(passwordHashPassed).toBeTruthy()
  })

  it('Should not be possible to create two users with the same email address', async () => {
    await userRepository.create({
      email: 'teste@gmail.com',
      password: 'dev123',
    })

    await expect(() =>
      sut.execute({ email: 'teste@gmail.com', password: 'dev123' })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
