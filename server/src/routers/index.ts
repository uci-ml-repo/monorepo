import * as trpc from '@trpc/server'
import type { Context } from '../context'

import donatedDatasetsRouter from './donated_datasets'

// setup tRPC router: merge other routers, add middleware and endpoints, etc.
//////////////////////////////////////////
const appRouter = trpc
  .router<Context>()
  .query('/', {
    async resolve() {
      return `Welcome to the UCI ML Repository's tRPC API. Read more about tRPC here: https://trpc.io/`
    },
  })
  .merge('donated_datasets.', donatedDatasetsRouter)

// the type export is used by the client to check API calls
export type Router = typeof appRouter

// export the router to be used in the context of a server, e.g. Sveltekit or Express
export default appRouter
