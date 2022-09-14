import * as trpc from '@trpc/server'
import type { Context } from '../context'

export default trpc
  .router<Context>()

  // find all users
  .query('getAll', {
    async resolve({ ctx: { database_services } }) {
      return await database_services.users.findAll()
    },
  })
