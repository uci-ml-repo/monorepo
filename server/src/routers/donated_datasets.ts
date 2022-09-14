import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const donatedDatasetsRouter = trpc
  .router<Context>()

  // return an array of approved dataset names
  ////////////////////////////////////////////
  .query('getNames', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.donated_datasets.getNames()
    },
  })

  // return an array of dataset objects matching any input parameters
  ////////////////////////////////////////////
  .query('getDatasets', {
    input: z
      .object({
        order: z.enum(['NumHits', 'DateDonated']).optional(),
        sort: z.enum(['asc', 'desc']).optional(),
        limit: z.number().optional(),
        status: z.string().optional(),
      })
      .optional(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.donated_datasets.getDatasets(input)
    },
  })

  // return the number of approved datasets
  ////////////////////////////////////////////
  .query('getCount', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.donated_datasets.getCount()
    },
  })

  .mutation('searchDatasets', {
    input: z.object({
      Types: z.string().optional(),
      Area: z.string().array().optional(),
      Task: z.string().optional(),
      NumAttributes: z.string().optional(),
      NumInstances: z.string().optional(),
      AttributeTypes: z.string().optional(),
    }),
    async resolve({ input, ctx: { database_services } }) {
      const result = await database_services.donated_datasets.searchDatasets(input)
      return result
    },
  })

  // given an ID, return the dataset
  ////////////////////////////////////////////
  .query('getById', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.donated_datasets.getById(input)
    },
  })

export default donatedDatasetsRouter
