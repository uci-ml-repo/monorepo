import type { LoadEvent } from '@sveltejs/kit'
import type { Router } from 'server/src/routers'
import * as trpc from '@trpc/client'

// create a new tRPC client
export default (loadFetch?: LoadEvent['fetch']) =>
  trpc.createTRPCClient<Router>({
    url: '/trpc',

    // if this runs on the server, then a special fetch function is used instead of the default
    ...(loadFetch && { fetch: loadFetch as typeof fetch }),
  })
