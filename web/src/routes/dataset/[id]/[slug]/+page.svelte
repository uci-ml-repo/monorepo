<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData

  import Accordion from '$components/Accordion.svelte'

  import PencilIcon from '$components/Icons/Pencil.svelte'

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

    <!-- Descriptive Information accordion -->
    <Accordion open>
      <div slot="title" class="flex gap-4 items-center">
        <h1 class="text-2xl text-primary">Information</h1>
        <button class="btn btn-ghost btn-circle btn-sm fill-accent">
          <PencilIcon />
        </button>
      </div>
      <div slot="content">
        <Descriptive {ID} />
      </div>
    </Accordion>

    <!-- Features accordion -->
    <Accordion open>
      <div slot="title" class="flex gap-4 items-center">
        <h1 class="text-2xl text-primary">Features</h1>
        <button class="btn btn-ghost btn-circle btn-sm fill-accent">
          <PencilIcon />
        </button>
      </div>
      <div slot="content">
        <Features {ID} />
      </div>
    </Accordion>

    <!-- Baseline Evals accordion -->
    <Accordion open>
      <h1 slot="title" class="text-2xl text-primary">Baseline Evals</h1>
      <div slot="content">
        <Evals {ID} />
      </div>
    </Accordion>

    <!-- Papers Cited In accordion -->
    <Accordion open>
      <h1 slot="title" class="text-2xl text-primary">Papers Citing this Dataset</h1>
      <div slot="content">
        <Papers {ID} />
      </div>
    </Accordion>

    <!-- Changelog accordion -->
    <Accordion open>
      <h1 slot="title" class="text-2xl text-primary">Changelog</h1>
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
