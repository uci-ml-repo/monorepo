import prisma_pkg from '@prisma/client'
import * as trpc from '@trpc/server'

import database_services from './services/database'
import edit_services from './services/edit'

const { PrismaClient } = prisma_pkg
const prisma = new PrismaClient()

// the router will import this context and all resolvers will have access
// to its properties via the ctx property
const createContext = async () => ({
  // prisma is available for debugging and test, shouldn't use in production
  prisma,

  // tRPC resolvers should rely on services for database access
  database_services: await database_services(prisma),
  edit_services: await edit_services(prisma),
})

export type Context = trpc.inferAsyncReturnType<typeof createContext>

export default createContext
