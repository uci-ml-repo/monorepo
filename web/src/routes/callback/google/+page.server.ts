import type { Load } from '@sveltejs/kit'
import trpc from '$lib/trpc'
import { redirect } from '@sveltejs/kit'

export const load: Load = async ({ url, fetch }) => {
  const code = url.searchParams.get('code')
  console.log({ url, code })

  if (!code) {
    throw redirect(307, '/login')
  }

  const res = await trpc(fetch).mutation('auth.login.google', code)
  console.log(res)
  throw redirect(307, '/login')
}