<script lang="ts">
  import { user } from '$lib/stores'
  import { collapse } from '$lib/actions'
  import { goto } from '$app/navigation'

  import Google from '$components/Auth/Google.svelte'
  import Github from '$components/Auth/Github.svelte'

  import { createForm } from 'felte'
  import { reporter, ValidationMessage } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  import registerSchema from '$lib/schemas/Register'
  import type { RegisterFormData } from '$lib/schemas/Register'

  import { useMutation } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  const mutation = useMutation(
    'auth.register.local',
    async (data: RegisterFormData) => await trpc(fetch).mutation('auth.register.local', data)
  )

  const { form } = createForm<RegisterFormData>({
    extend: [validator({ schema: registerSchema }), reporter],
    onSubmit: (data) => {
      $mutation.mutate(data, {
        onSuccess: (data) => {
          user.login(data)
          goto('/')
        },
      })
    },
  })

  let open = false

  const openForm = () => (open = true)
  const closeForm = () => (open = false)
</script>

<div class="max-w-xl mx-auto my-16 flex flex-col gap-4">
  <h1 class="text-2xl text-primary font-semibold">Sign Up</h1>
  <p>
    Already have an account?
    <a href="/login" class="text-lg text-primary hover:underline"> Sign In </a>
  </p>
  <form use:form>
    <div class="flex flex-col gap-4" use:collapse={{ open, lineClamp: 0, baseHeight: 0 }}>
      <label>
        <span>First Name</span>
        <input type="text" name="firstName" class="input input-bordered w-full" />
        <ValidationMessage for="firstName" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>

      <label>
        <span>Last Name</span>
        <input type="text" name="lastName" class="input input-bordered w-full" />
        <ValidationMessage for="lastName" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>

      <label>
        <span>Email</span>
        <input type="text" name="user" class="input input-bordered w-full" />
        <ValidationMessage for="user" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>

      <label>
        <span>Password</span>
        <input type="password" name="pass" class="input input-bordered w-full" />
        <ValidationMessage for="pass" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>

      <label>
        <span>Confirm Password</span>
        <input type="password" name="passConfirm" class="input input-bordered w-full" />
        <ValidationMessage for="passConfirm" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>

      <label>
        <span>Institution</span>
        <input type="text" name="institution" class="input input-bordered w-full" />
        <ValidationMessage for="institution" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>

      <label>
        <span>Address</span>
        <input type="password" name="address" class="input input-bordered w-full" />
        <ValidationMessage for="address" let:messages>
          <span class="text-error">{messages || ''}</span>
        </ValidationMessage>
      </label>
      <div class="flex gap-4">
        <button type="button" class="btn btn-error btn-outline" on:click={closeForm}
          >Back</button
        >
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </form>
  {#if !open}
    <button class="btn btn-primary" on:click|preventDefault={openForm}
      >Sign up with Email</button
    >
  {/if}
  <Google>Sign up with Google</Google>
  <Github>Sign up with Github</Github>
</div>
