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
  <!-- the header wraps around the entire app because of the side drawer -->
  <Header>
    <!-- add the body of the page and the footer to the default slot -->
    <div>
      <!-- the main content should take up at least 1 vertical screen to push the footer to the bottom -->
      <div class="min-h-screen">
        <slot />
      </div>
      <!-- footer is below main content-->
      <Footer />
    </div>
  </Header>
</QueryClientProvider>
