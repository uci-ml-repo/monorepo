import { z } from 'zod'

// all properties are nullable strings that can be converted to null if empty strings
const DescriptiveSchema = z.object({
  purpose: z
    .string()
    .nullable()
    .transform((k) => k || null),

  funding: z
    .string()
    .nullable()
    .transform((k) => k || null),

  represent: z
    .string()
    .nullable()
    .transform((k) => k || null),

  dataSplits: z
    .string()
    .nullable()
    .transform((k) => k || null),

  sensitiveInfo: z
    .string()
    .nullable()
    .transform((k) => k || null),

  preprocessingDescription: z
    .string()
    .nullable()
    .transform((k) => k || null),

  used: z
    .string()
    .nullable()
    .transform((k) => k || null),

  otherInfo: z
    .string()
    .nullable()
    .transform((k) => k || null),

  datasetCitation: z
    .string()
    .nullable()
    .transform((k) => k || null),
})

export default DescriptiveSchema
export type DescriptiveType = z.TypeOf<typeof DescriptiveSchema>
