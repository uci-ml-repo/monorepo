<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'
  import DropdownText from '$components/DropdownText.svelte'

  export let ID = 0

  // get descriptive [question, answer] array
  //////////////////////////////////////////
  const query = useQuery(
    ['descriptive.getDescriptiveQA', ID],
    async () => await trpc(fetch).query('descriptive.getDescriptiveQA', ID)
  )

  // save the query data in a reactive variable
  $: descriptive_qa = $query?.data || []
</script>

<div class="flex flex-col gap-6">
  {#if descriptive_qa?.length > 0}
    {#each descriptive_qa as [question, answer]}
      <div class="flex flex-col">
        <p class="text-lg font-semibold">{question}</p>
        <DropdownText>{answer}</DropdownText>
      </div>
    {/each}
  {:else}
    <p class="text-xl">N/A</p>
  {/if}
</div>
