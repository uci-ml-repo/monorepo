import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const keywordsRouter = trpc
  .router<Context>()

  // return an array of approved keyword names
  ////////////////////////////////////////////
  .query('getNames', {
    async resolve({ ctx: { database_services } }) {
      return database_services.keywords.getNames()
    },
  })

  // given a dataset ID, return an array of the corresponding keywords
  ////////////////////////////////////////////
  .query('getDatasetKeywords', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.keywords.getDatasetKeywords(input)
    },
  })

export default keywordsRouter
