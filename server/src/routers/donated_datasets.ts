import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

// setup tRPC router: merge other routers, add middleware and endpoints, etc.
//////////////////////////////////////////
const donatedDatasetsRouter = trpc
  .router<Context>()
  .query('getNames', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.donated_datasets.getNames()
    },
  })
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

// export the router to be used in the context of a server, e.g. Sveltekit or Express
export default donatedDatasetsRouter
