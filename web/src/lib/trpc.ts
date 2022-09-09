import type { LoadEvent } from '@sveltejs/kit'
import type { Router } from 'server/src/routers'
import * as trpc from '@trpc/client'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'

// create a new tRPC client
export default (loadFetch?: LoadEvent['fetch']) =>
  trpc.createTRPCClient<Router>({
    url: `${import.meta.env.DEV ? 'http://localhost:5173' : 'http://localhost:4173'}/trpc`,

    // if this runs on the server, then a special fetch function is used instead of the default
    ...(loadFetch && { fetch: loadFetch as typeof fetch }),
  })

type Query = keyof Router['_def']['queries']
type Mutation = keyof Router['_def']['mutations']

// Useful types
export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<
  Router['_def']['queries'][RouteKey]
>
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<
  Router['_def']['queries'][RouteKey]
>
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
  Router['_def']['mutations'][RouteKey]
>
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<
  Router['_def']['mutations'][RouteKey]
>
