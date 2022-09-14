<script lang="ts">
  import BasicInfo from './BasicInfo.svelte'
  import Descriptive from './Descriptive.svelte'
  import Tabular from './Tabular.svelte'

  import DonationPolicy from '$markdown/DonationPolicy.md'

  import type {
    BasicInfoFormData,
    TabularFormData,
    DescriptiveFormData,
  } from '$lib/schemas/Donation'

  import { donationFormData } from '$lib/stores'

  const pages = [BasicInfo, Tabular, Descriptive]
  let page = 0

  function onSubmit(values: BasicInfoFormData | TabularFormData | DescriptiveFormData) {
    // update the parent state
    donationFormData.update(values)
    console.log($donationFormData)

    // if at end of form, make request, otherwise increment page counter
    if (page === pages.length - 1) {
      console.log($donationFormData)
      console.log('Done!')
    } else {
      page += 1
    }
  }

  function onBack(values: BasicInfoFormData | TabularFormData | DescriptiveFormData) {
    donationFormData.update(values)
    console.log($donationFormData)
    if (page !== 0) {
      page -= 1
    }
  }

  let agree = false
  const consent = () => (agree = true)
</script>

<svelte:head>
  <title>Donation - UC Irvine Machine Learning Repository</title>
</svelte:head>

<div class="my-16">
  <div class="flex flex-col items-center gap-4">
    <DonationPolicy />
    {#if !agree}
      <button class="btn btn-primary w-1/2 max-w-lg" on:click={consent}>I agree</button>
    {:else}
      <div class="divider mx-auto w-1/2" />
      <div class="w-full">
        <!-- choose the component to render by binding it to a component in the array 
      all components are given props to handle submission, going back,
      and their initial/stored values -->
        <svelte:component this={pages[page]} {onSubmit} onBack={page === 0 ? null : onBack} />
      </div>
    {/if}
  </div>
</div>
