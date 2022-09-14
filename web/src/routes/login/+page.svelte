<script lang="ts">
  import Google from '$components/Auth/Google.svelte'
  import Github from '$components/Auth/Github.svelte'

  import type { LoginFormData } from '$lib/schemas/Login'
  import LoginSchema from '$lib/schemas/Login'
  import { validator } from '@felte/validator-zod'
  import { reporter } from '@felte/reporter-svelte'
  import { createForm } from 'felte'

  import { useMutation } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation'

  const mutation = useMutation(
    'auth.local.login',
    async (data: LoginFormData) => await trpc(fetch).mutation('auth.login.local', data)
  )

  const { form } = createForm<LoginFormData>({
    onSubmit: (data) => {
      $mutation.mutate(data, {
        onSuccess: (newUser) => {
          error = false
          message = ''

          user.login(newUser)
          goto('/')
        },
        onError: (err) => {
          error = true
          if (err instanceof Error) {
            message = err.message
          } else {
            message = 'Error'
          }
        },
      })
    },
    extend: [validator({ schema: LoginSchema }), reporter],
  })

  let error = false
  let message = ''
</script>

<svelte:head>
  <title>Login - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="max-w-xl mx-auto my-16 flex flex-col gap-4">
  {#if error}
    <div class="alert alert-error shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>{message}</span>
      </div>
    </div>
  {/if}

  <h1 class="text-2xl text-primary font-semibold">Sign In</h1>
  <p>
    Don't have an account?
    <a href="/register" class="text-lg text-primary hover:underline">Sign up</a>
  </p>
  <form use:form class="flex flex-col gap-4">
    <label>
      <span>Email</span>
      <input type="text" name="user" class="input input-bordered w-full" />
    </label>
    <label>
      <span>Password</span>
      <input type="password" name="pass" class="input input-bordered w-full" />
    </label>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  <Google />
  <Github />
</div>
