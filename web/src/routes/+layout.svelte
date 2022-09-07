<script lang="ts">
  // import the base css file to compile TailwindCSS into the application
  import '../app.css'

  // the Svelte-Query provider enables the useQuery and useMutation hooks throughout the app
  import { QueryClientProvider } from '@sveltestack/svelte-query'
  import { queryClient } from '$lib/query'

  import Header from '$components/Header/index.svelte'
</script>

<QueryClientProvider client={queryClient}>
  <Header>
    <slot />
  </Header>
</QueryClientProvider>
