import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const evalsRouter = trpc
  .router<Context>()

  // given a dataset ID, return an array of evals with nested properties
  // for the metrics and models
  ////////////////////////////////////////////
  .query('getByDatasetId', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.evals.getByDatasetId(input)
    },
  })

export default evalsRouter
