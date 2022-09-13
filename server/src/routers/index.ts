import * as trpc from '@trpc/server'
import type { Context } from '../context'

import donatedDatasetsRouter from './donated_datasets'
import descriptiveRouter from './descriptive'
import keywordsRouter from './keywords'
import evalsRouter from './evals'
import attributesRouter from './attributes'
import papersRouter from './papers'
import citationRouter from './citation'
import creatorsRouter from './creators'
import editsRouter from './edits'
import notesRouter from './notes'
import usersRouter from './users'

// setup tRPC router: merge other routers, add middleware and endpoints, etc.
//////////////////////////////////////////
const appRouter = trpc
  .router<Context>()

  // test endpoint
  ////////////////////////////////////////////
  .query('/', {
    async resolve() {
      return `Welcome to the UCI ML Repository's tRPC API. Read more about tRPC here: https://trpc.io/`
    },
  })

  // merge all other routers and scope them to their respective routes
  // e.g. all routes in donated_datasets are reached with "donated_datasets.<route>"
  ////////////////////////////////////////////
  .merge('donated_datasets.', donatedDatasetsRouter)
  .merge('keywords.', keywordsRouter)
  .merge('descriptive.', descriptiveRouter)
  .merge('evals.', evalsRouter)
  .merge('attributes.', attributesRouter)
  .merge('papers.', papersRouter)
  .merge('citation.', citationRouter)
  .merge('creators.', creatorsRouter)
  .merge('edits.', editsRouter)
  .merge('notes.', notesRouter)
  .merge('users.', usersRouter)

// the type export is used by the client to check API calls
export type Router = typeof appRouter

// export the router to be used in the context of a server, e.g. Sveltekit or Express
export default appRouter
