<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData

  import Accordion from '$components/Accordion.svelte'

  import Header from '$components/DatasetDetails/Header.svelte'
  import Descriptive from '$components/DatasetDetails/Descriptive.svelte'
  import Evals from '$components/DatasetDetails/Evals.svelte'
  import Features from '$components/DatasetDetails/Features.svelte'
  import Papers from '$components/DatasetDetails/Papers.svelte'
  import Changelog from '$components/DatasetDetails/Changelog.svelte'

  import Interactions from '$components/DatasetDetails/Interactions.svelte'
  import Keywords from '$components/DatasetDetails/Keywords.svelte'
  import Creators from '$components/DatasetDetails/Creators.svelte'
  import DOI from '$components/DatasetDetails/DOI.svelte'
  import Notes from '$components/DatasetDetails/Notes.svelte'
  import License from '$components/DatasetDetails/License.svelte'

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
      <div slot="content">
        <Features {ID} />
      </div>
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
      <div slot="content">
        <Papers {ID} />
      </div>
    </Accordion>

    <!-- features accordion -->
    <Accordion open>
      <span slot="title" class="text-2xl text-primary">Changelog</span>
      <div slot="content">
        <Changelog {ID} />
      </div>
    </Accordion>
  </div>

  <div class="col-span-12 col-span-12 md:col-span-4 p-4">
    <Interactions {ID} />

    <div class="divider" />

    <Keywords {ID} />

    <div class="divider" />

    <Creators {ID} />

    <div class="divider" />

    <DOI {ID} />

    <div class="divider" />

    <Notes {ID} />

    <div class="divider" />

    <License {ID} />
  </div>
</div>
