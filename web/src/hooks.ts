import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'

// use the trpc server and context provided by the standalone "server" project in this monorepo
import router from 'server/src/routers'
import createContext from 'server/src/context'

// server side Sveltekit loads the environment variables
import 'dotenv/config'

// intercept requests from the application that start with the "url" parameter, e.g. /trpc and direct it to the tRPC resolver
// if it doesn't start with the url, then it'll be passed to Sveltekit normally
export const handle: Handle = async ({ event, resolve }) => {
  const response = await createTRPCHandle({
    url: '/trpc',
    router,
    createContext,
    event,
    resolve,
  })
  return response
}
