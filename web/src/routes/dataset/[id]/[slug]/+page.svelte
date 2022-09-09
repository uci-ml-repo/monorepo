<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
  import Header from '$components/DatasetDetails/Header.svelte'

  const { ID } = data
</script>

<div class="grid grid-cols-12 gap-4 max-w-screen-xl mx-auto my-12 p-4">
  <div class="bg-primary col-span-12 md:col-span-8">
    <Header {ID} />
  </div>
  <div class="bg-primary col-span-12 col-span-12 md:col-span-4">
    <h1 class="text-white text-4xl">Sidebar</h1>
  </div>
</div>
