<script lang="ts">
  // import the base css file to compile TailwindCSS into the application
  import '../app.css'

  // the Svelte-Query provider enables the useQuery and useMutation hooks throughout the app
  import { QueryClientProvider } from '@sveltestack/svelte-query'
  import { queryClient } from '$lib/query'
</script>

<!-- provide the Svelte-Query client to the application -->
<QueryClientProvider client={queryClient}>
  <!-- temporary navbar -->
  <a href="/" class="btn">Home</a>
  <a href="/about" class="btn">About</a>
  <a href="/privacy" class="btn">Privacy</a>
  <!-- Insert page content from routes here -->
  <slot />
</QueryClientProvider>
