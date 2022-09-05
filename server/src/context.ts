import prisma_pkg from '@prisma/client'
import * as trpc from '@trpc/server'

const { PrismaClient } = prisma_pkg
const prisma = new PrismaClient()

// the router will import this context and all resolvers will have access
// to its properties via the ctx property
const createContext = async () => ({
  prisma,
})

export type Context = trpc.inferAsyncReturnType<typeof createContext>

export default createContext
