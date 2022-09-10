import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const attributesRouter = trpc
  .router<Context>()
  .query('getAttributes', {
    // given a dataset ID, return the features associated with it in a table format
    ////////////////////////////////////////////
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.attributes.getTable(input)
    },
  })

  // given a dataset ID, return the attributes as a list of [question, answer] tuples
  ////////////////////////////////////////////
  .query('getFeatures', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.attributes.getQA(input)
    },
  })

export default attributesRouter
