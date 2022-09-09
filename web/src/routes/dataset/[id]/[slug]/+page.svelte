<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData

  import Accordion from '$components/Accordion.svelte'

  import Header from '$components/DatasetDetails/Header.svelte'
  import Descriptive from '$components/DatasetDetails/Descriptive.svelte'
  import Evals from '$components/DatasetDetails/Evals.svelte'

  const { ID } = data
</script>

<div class="grid grid-cols-12 gap-4 max-w-screen-xl mx-auto my-12 p-4">
  <div class="col-span-12 md:col-span-8 flex flex-col gap-8">
    <Header {ID} />

    <!-- descriptive questions accordion -->
    <Accordion open>
      <span slot="title" class="text-2xl text-primary">Descriptive</span>
      <div slot="content">
        <Descriptive {ID} />
      </div>
    </Accordion>

    <!-- features accordion -->
    <Accordion open>
      <span slot="title" class="text-2xl text-primary">Features</span>
      <div slot="content" class="h-96 bg-red-200" />
    </Accordion>

    <!-- evals accordion -->
    <Accordion open>
      <span slot="title" class="text-2xl text-primary">Baseline Evals</span>
      <div slot="content">
        <Evals {ID} />
      </div>
    </Accordion>

    <!-- features accordion -->
    <Accordion open>
      <span slot="title" class="text-2xl text-primary">Papers Citing this Dataset</span>
      <div slot="content" class="h-96 bg-red-200" />
    </Accordion>

    <!-- features accordion -->
    <Accordion open>
      <span slot="title" class="text-2xl text-primary">Changelog</span>
      <div slot="content" class="h-96 bg-red-200" />
    </Accordion>
  </div>
  <div class="shadow col-span-12 col-span-12 md:col-span-4 p-4">
    <h1 class="text-4xl h-24">Interactions</h1>
    <div class="divider" />
    <h1 class="text-4xl h-24">Keywords</h1>
    <div class="divider" />
    <h1 class="text-4xl h-24">Creators</h1>
    <div class="divider" />
    <h1 class="text-4xl h-24">DOI</h1>
    <div class="divider" />
    <h1 class="text-4xl h-24">Notes</h1>
    <div class="divider" />
    <h1 class="text-4xl h-24">License</h1>
  </div>
</div>
