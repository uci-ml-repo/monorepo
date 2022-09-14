<script lang="ts">
  import BasicInfo from './BasicInfo.svelte'
  import Descriptive from './Descriptive.svelte'
  import Tabular from './Tabular.svelte'

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
</script>

<svelte:head>
  <title>Donation - UC Irvine Machine Learning Repository</title>
</svelte:head>

<!-- choose the component to render by binding it to a component in the array 
all components are given props to handle submission, going back,
and their initial/stored values -->

<div class="my-16">
  <svelte:component this={pages[page]} {onSubmit} onBack={page === 0 ? null : onBack} />
</div>
