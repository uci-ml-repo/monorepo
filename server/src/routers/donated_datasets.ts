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
        // limit the order options for now
        order: z.enum(['NumHits', 'DateDonated']).optional(),

        sort: z.enum(['asc', 'desc']).optional(),
        limit: z.number().optional(),
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

export default donatedDatasetsRouter
