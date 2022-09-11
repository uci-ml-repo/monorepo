import { z } from 'zod'

// an initially invalid creator that will force user to enter input, e.g. during form validation
export const nullDefaultCreator = {
  firstName: null,
  lastName: null,
  email: null,
  address: null,
  institution: null,
}

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
    .union([z.string().email(), z.string().length(0)])
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
