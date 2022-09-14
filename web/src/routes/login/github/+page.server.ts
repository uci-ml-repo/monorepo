import type { Load } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import 'dotenv/config'

export const load: Load = async () => {
  throw redirect(
    307,
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  )
}
