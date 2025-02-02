import { z } from 'zod'

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((data) => {
      const hasNumber = /\d/.test(data)
      const hasSpecialChar = /[!@#$%^&*]/.test(data)

      return hasNumber && hasSpecialChar
    }),
})
export type CreateUser = z.infer<typeof CreateUserSchema>
