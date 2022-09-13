/*
 * the donation schema is a combination of smaller forms;
 * a schema is made for each step in the donation process, and merged
 * to create the full donation schema
 *
 * all these types and schemas are used by the donation pages
 */

import { z } from 'zod'
import { CreatorSchema, FileSchema, MetadataSchema, DescriptiveSchema } from '$lib/schemas'

// schema setup
//////////////////////////////////////////
export const BasicInfoFormSchema = z.object({
  metadata: MetadataSchema.extend({
    Name: z.string().min(1, { message: 'Please enter a dataset name' }),
  }),
  creator: CreatorSchema,
  creators: CreatorSchema.array(),
  keywords: z.string().array(),
})

export const TabularFormSchema = z.object({
  tabular: z.object({
    missingValues: z.any().nullable(),
  }),
  Graphics: FileSchema.nullable(),
  files: z.object({
    supplemental: FileSchema.nullable(),
    csv: FileSchema.nullable(),
    testData: FileSchema.nullable(),
  }),
  attributes: z.any().array(),
})

export const DescriptiveFormSchema = z.object({
  descriptive: DescriptiveSchema,
})

// merge all the individual schemas to create the donation schema
export const DonationSchema =
  BasicInfoFormSchema.merge(TabularFormSchema).merge(DescriptiveFormSchema)

// type definitions
//////////////////////////////////////////
export type BasicInfoFormData = z.TypeOf<typeof BasicInfoFormSchema>
export type TabularFormData = z.TypeOf<typeof TabularFormSchema>
export type DescriptiveFormData = z.TypeOf<typeof DescriptiveFormSchema>
export type DonationFormData = z.TypeOf<typeof DonationSchema>
