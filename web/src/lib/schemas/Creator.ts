import { z } from 'zod'

// an initially valid creator, but with empty fields for first name and last name
export const defaultCreator = {
  firstName: '',
  lastName: '',
  email: null,
  address: null,
  institution: null,
}

const CreatorSchema = z.object({
  firstName: z.string().min(1, { message: 'Please enter a first name' }),

  lastName: z.string().min(1, { message: 'Please enter a last name' }),

  // either an email, or empty string; if empty string, convert to null on submit
  email: z
    .string()
    .email()
    .or(z.string().length(0)) // email can be an email or empty string, which is converted to null
    .nullable()
    .transform((k) => k || null),

  institution: z
    .string()
    .nullable()
    .transform((k) => k || null),

  address: z
    .string()
    .nullable()
    .transform((k) => k || null),
})

export type CreatorType = z.TypeOf<typeof CreatorSchema>
export default CreatorSchema
