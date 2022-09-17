<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData

  import Accordion from '$components/UI/Accordion.svelte'

  import PencilIcon from '$components/Icons/Pencil.svelte'
  import XIcon from '$components/Icons/X.svelte'

  // center stage
  import Header from '$components/DatasetDetails/Header.svelte'
  import Descriptive from '$components/DatasetDetails/Descriptive.svelte'
  import Features from '$components/DatasetDetails/Features.svelte'
  import Evals from '$components/DatasetDetails/Evals.svelte'
  import Papers from '$components/DatasetDetails/Papers.svelte'
  import Changelog from '$components/DatasetDetails/Changelog.svelte'

  // right sidebar
  import Interactions from '$components/DatasetDetails/Interactions.svelte'
  import Keywords from '$components/DatasetDetails/Keywords.svelte'
  import Creators from '$components/DatasetDetails/Creators.svelte'
  import DOI from '$components/DatasetDetails/DOI.svelte'
  import Notes from '$components/DatasetDetails/Notes.svelte'
  import License from '$components/DatasetDetails/License.svelte'

  // edit modals
  import DescriptiveEdit from '$components/Forms/Descriptive.svelte'
  import FeaturesEdit from '$components/Forms/Features.svelte'

  const { ID } = data

  // editing controls on this page: Descriptive Edit, Features Edit
  // all other editing modals/popups, etc. are handled by the children components
  ////////////////////////////////////////

  // descriptive edit controls
  //////////////////////////////////////////
  let descriptiveEditOpen = false

  const openDescriptiveEdit = () => (descriptiveEditOpen = true)
  const closeDescriptiveEdit = () => (descriptiveEditOpen = false)

  // features edit controls
  //////////////////////////////////////////
  let featureEditOpen = false

  const openFeatureEdit = () => (featureEditOpen = true)
  const closeFeatureEdit = () => (featureEditOpen = false)
</script>

<svelte:head>
  <title>Dataset - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="grid grid-cols-12 gap-8 max-w-screen-xl mx-auto my-12 p-4">
  <div class="col-span-12 md:col-span-8 flex flex-col gap-8">
    <Header {ID} />

    <!-- Descriptive Information accordion -->
    <Accordion open>
      <!-- accordion title for descriptive information and edit buttons -->
      <div slot="title" class="flex gap-4 items-center">
        <h1 class="text-2xl text-primary">Information</h1>
        {#if descriptiveEditOpen}
          <button
            class="btn btn-error btn-outline btn-circle btn-sm"
            on:click|stopPropagation={closeDescriptiveEdit}
          >
            <XIcon />
          </button>
        {:else}
          <button
            class="btn btn-ghost btn-circle btn-sm fill-accent"
            on:click|stopPropagation={openDescriptiveEdit}
          >
            <PencilIcon />
          </button>
        {/if}
      </div>

      <!-- accordion content for descriptive information -->
      <!-- either descriptive questions/answers, or the editing form -->
      <div slot="content">
        {#if descriptiveEditOpen}
          <DescriptiveEdit {ID} handleClose={closeDescriptiveEdit}>
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button
                type="button"
                class="btn btn-error btn-outline"
                on:click|preventDefault={closeDescriptiveEdit}>Cancel</button
              >
            </div>
          </DescriptiveEdit>
        {:else}
          <Descriptive {ID} />
        {/if}
      </div>
    </Accordion>

    <!-- Features accordion -->
    <Accordion open>
      <!-- accordion title for features and edit buttons -->
      <div slot="title" class="flex gap-4 items-center">
        <h1 class="text-2xl text-primary">Features</h1>
        {#if featureEditOpen}
          <button
            class="btn btn-error btn-outline btn-circle btn-sm"
            on:click|stopPropagation={closeFeatureEdit}
          >
            <XIcon />
          </button>
        {:else}
          <button
            class="btn btn-ghost btn-circle btn-sm fill-accent"
            on:click|stopPropagation={openFeatureEdit}
          >
            <PencilIcon />
          </button>
        {/if}
      </div>

      <!-- accordion content for features table; either table or editing spreadsheet -->
      <div slot="content">
        {#if featureEditOpen}
          <FeaturesEdit {ID} handleClose={closeFeatureEdit}>
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button
                type="button"
                class="btn btn-error btn-outline"
                on:click|preventDefault={closeFeatureEdit}>Cancel</button
              >
            </div>
          </FeaturesEdit>
        {:else}
          <Features {ID} />
        {/if}
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

  <!-- right sidebar -->
  <div class="col-span-12 col-span-12 md:col-span-4">
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
