import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'
import { createExpressMiddleware } from '@trpc/server/adapters/express'

// setup tRPC router: merge other routers, add middleware and endpoints, etc.
//////////////////////////////////////////
const keywordsRouter = trpc
  .router<Context>()
  .query('getKeywords', {
    async resolve({ ctx: { database_services } }) {
      return database_services.keywords.getNames()
    },
  })
  .query('getDatasetKeywords', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.keywords.getDatasetKeywords(input)
    },
  })
// export the router to be used in the context of a server, e.g. Sveltekit or Express
export default keywordsRouter
