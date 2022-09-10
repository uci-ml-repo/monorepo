import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

export default trpc
  .router<Context>()

  // return an array of tuples that is used to render the edits table on the client
  // not sure which side should handle this processing atm
  .query('getByDatasetId', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.edits.getByDatasetId(input)
    },
  })
