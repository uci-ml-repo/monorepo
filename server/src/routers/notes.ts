import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const notesRouter = trpc
  .router<Context>()

  .query('getByDatasetId', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return await database_services.notes.getByDatasetId(input)
    },
  })

  .query('getAll', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.notes.findAll()
    },
  })

export default notesRouter
