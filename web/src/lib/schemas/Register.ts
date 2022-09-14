import { z } from 'zod'

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Please enter a first name' }),
    lastName: z.string().min(1, { message: 'Please enter a last name' }),
    user: z.string().min(1, { message: 'Please enter an email' }),
    pass: z.string().min(6, { message: 'Must be at least 6 characters' }),
    passConfirm: z.string().min(6, { message: 'Must be at least 6 characters' }),
    institution: z.string(),
    address: z.string(),
  })
  .refine((form) => form.pass === form.passConfirm, {
    message: 'Passwords must match',
    path: ['password'],
  })

export type RegisterFormData = z.TypeOf<typeof registerSchema>
export default registerSchema
