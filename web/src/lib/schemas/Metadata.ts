import { z } from 'zod'

// basic metadata schema for editing,
// may be extended during a donation process, e.g.
// const donationMetadata = MetadataSchema.extend({ ...moreProperties })

const MetadataSchema = z.object({
  Abstract: z.string().min(1, { message: 'Please provide a description' }),

  Types: z.string().array().min(1, { message: 'Please select a type' }),

  Area: z.string().min(1, { message: 'Please select an area' }),

  // radio buttons should convert DOI between null and empty string
  DOI: z.string().nullable(),

  Task: z.string().array().min(1, { message: 'Please select a task' }),
})

export type MetadataType = z.TypeOf<typeof MetadataSchema>
export default MetadataSchema
