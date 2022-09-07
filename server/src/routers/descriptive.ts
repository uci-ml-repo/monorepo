import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import DescriptiveService from '../services/database/descriptive'

// setup tRPC router: merge other routers, add middleware and endpoints, etc.
//////////////////////////////////////////
const descriptiveRouter = trpc
  .router<Context>()
  .query('getDescriptive', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.descriptive.getDescriptive(input)
    },
  })
  .query('getDescriptiveQA', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.descriptive.getDescriptiveQA(input)
    },
  })
// export the router to be used in the context of a server, e.g. Sveltekit or Express
export default descriptiveRouter
