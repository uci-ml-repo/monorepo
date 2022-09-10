import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const papersRouter = trpc
  .router<Context>()

  // given a dataset ID, return an array of all papers associated with it (foreign and native)
  ////////////////////////////////////////////
  .query('getAll', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.papers.getAll(input)
    },
  })

  // given a dataset ID, return an array of all summaries for all papers associated with it
  // a summary consists of a title, author info, publication info, and the URL
  ////////////////////////////////////////////
  .query('getAllSummary', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.papers.getAllSummary(input)
    },
  })
export default papersRouter
