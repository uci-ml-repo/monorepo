import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const descriptiveRouter = trpc
  .router<Context>()

  // given a dataset ID, return an object represent descriptive questions/answers
  ////////////////////////////////////////////
  .query('getDescriptive', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.descriptive.getDescriptive(input)
    },
  })

  // given a dataset ID, return an array of question/answer tuples
  ////////////////////////////////////////////
  .query('getDescriptiveQA', {
    input: z.number(),
    async resolve({ input, ctx: { database_services } }) {
      return database_services.descriptive.getDescriptiveQA(input)
    },
  })
export default descriptiveRouter
