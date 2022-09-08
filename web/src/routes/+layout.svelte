<script lang="ts">
  // import the base css file to compile TailwindCSS into the application
  import '../app.css'

  // the Svelte-Query provider enables the useQuery and useMutation hooks throughout the app
  import { QueryClientProvider } from '@sveltestack/svelte-query'
  import { queryClient } from '$lib/query'

  import Header from '$components/Header/index.svelte'
  import Footer from '$components/Footer.svelte'
</script>

<QueryClientProvider client={queryClient}>
  <!-- the header wraps around the entire app because of the drawer -->
  <Header>
    <!-- add the body of the page and the footer to the default slot -->
    <div>
      <slot />
      <Footer />
    </div>
  </Header>
</QueryClientProvider>
