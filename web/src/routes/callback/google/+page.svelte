<script lang="ts">
  import { goto } from '$app/navigation'
  import { user } from '$lib/stores'
  import type { User } from '$lib/stores/user'
  import { onMount } from 'svelte'

  // the load function will perform a mutation to obtain the user login information
  // the client has to set the store data in order for it to persist properly,
  // then redirect once done

  export let data: User

  // on mount, use the data provided by the shadow endpoint to initialize the user,
  // then redirect to the home page
  onMount(() => {
    user.login(data)
    goto('/')
  })
</script>
