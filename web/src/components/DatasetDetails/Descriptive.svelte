<script lang="ts">
  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'
  import DropdownText from '$components/DropdownText.svelte'

  export let ID = 0

  const query = useQuery(
    'descriptive.getDescriptiveQA',
    async () => await trpc(fetch).query('descriptive.getDescriptiveQA', ID)
  )

  $: descriptive_qa = $query?.data || []
</script>

<div class="py-4 flex flex-col gap-6">
  {#if descriptive_qa?.length > 0}
    {#each descriptive_qa as [question, answer]}
      <div class="flex flex-col">
        <p class="text-lg font-semibold">{question}</p>
        <DropdownText>{answer}</DropdownText>
      </div>
    {/each}
  {/if}
</div>
