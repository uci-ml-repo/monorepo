import { z } from 'zod'

const LoginSchema = z.object({
  user: z.string(),
  pass: z.string(),
})

export type LoginFormData = z.TypeOf<typeof LoginSchema>
export default LoginSchema
