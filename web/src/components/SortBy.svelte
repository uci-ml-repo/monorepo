<script lang="ts">
  import { collapse } from '$lib/actions'
  import SortIcon from '$components/Icons/Sort.svelte'
  import { useMutation, useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import { z, type TypeOf } from 'zod'
  import { queryClient } from '$lib/query'
  import { createEventDispatcher } from 'svelte'

  const SortSchema = z.enum([
    'NumHits',
    'DateDonated',
    'NumInstances',
    'Name',
    'NumAttributes',
  ])
  const SortOptionSchema = z.enum(['asc', 'desc']).optional()
  type SortData = z.TypeOf<typeof SortSchema>
  type SortOptions = z.TypeOf<typeof SortOptionSchema>

  let value: SortData
  let label = ''
  let sort: SortOptions

  value = 'NumHits'
  sort = 'desc'

  const dispatch = createEventDispatcher()

  const sortMutation = useMutation('donated_datasets.grabDatasets', async (data: SortData) => {
    const newDatasets = await trpc(fetch).mutation('donated_datasets.grabDatasets', {
      order: data,
      sort,
    })
    dispatch('update', {
      datasets: newDatasets,
    })
  })

  const handleClick = (option: OptionType) => {
    sort = option.value === value && sort === 'desc' ? 'asc' : 'desc'
    value = option.value
    label = option.label
    $sortMutation.mutate(option.value)
  }

  type OptionType = { label: string; value: SortData }

  const options: OptionType[] = [
    {
      label: 'Name',
      value: 'Name',
    },
    {
      label: '# Instances',
      value: 'NumInstances',
    },
    {
      label: '# Views',
      value: 'NumHits',
    },
    {
      label: '# Attributes',
      value: 'NumAttributes',
    },
    {
      label: 'Date Donated',
      value: 'DateDonated',
    },
  ]
</script>

<div class="dropdown">
  <label for="" tabindex="0" class="btn btn-sm btn-primary flex gap-2 flex-wrap h-fit">
    <!-- label for the sort button-->
    <div class="flex items-center gap-2">
      <SortIcon />
      <span>Sort By </span>
    </div>
    <div
      use:collapse={{ open: label !== '', horizontal: true }}
      class="overflow-hidden flex transition-all"
    >
      <span>
        {label}
      </span>
    </div>
  </label>

  <!-- dropdown menu for the sort button -->
  <ul
    tabindex="0"
    class="dropdown-content menu shadow flex flex-col bg-base-100 gap-2 w-36 p-2"
  >
    {#each options as option}
      <li
        on:click|preventDefault|stopPropagation={() => handleClick(option)}
        class="btn cursor-pointer btn-sm rounded-none text-left"
        class:btn-ghost={option.value !== value}
        class:btn-secondary={option.value === value}
      >
        {option.label}
      </li>
    {/each}
  </ul>
</div>
