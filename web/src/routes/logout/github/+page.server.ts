import type { Load } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import 'dotenv/config'
import trpc from '$lib/trpc'

export const load: Load = async ({ fetch }) => {
  console.log(await trpc(fetch).mutation('auth.logout.github', 640))
  throw redirect(307, '/login')
}
