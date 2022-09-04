import * as trpc from '@trpc/server'
import type { Context } from '../context'

const appRouter = trpc.router<Context>().query('/', {
  async resolve() {
    return `Welcome to the UCI ML Repository's tRPC API. Read more about tRPC here: https://trpc.io/`
  },
})

export type Router = typeof appRouter
export default appRouter
