import prisma_pkg from '@prisma/client'
import * as trpc from '@trpc/server'

const { PrismaClient } = prisma_pkg
const prisma = new PrismaClient()

const createContext = async () => ({
  prisma,
})

export type Context = trpc.inferAsyncReturnType<typeof createContext>

export default createContext
