<script lang="ts">
  import { collapse } from '$lib/actions'
  import SortIcon from '$components/Icons/Sort.svelte'
  import { useMutation, useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import { z } from 'zod'

  let value = {}

  const SortSchema = z.object({
    order: z
      .enum(['NumHits', 'DateDonated', 'NumInstances', 'Name', 'NumAttributes'])
      .optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    limit: z.number().optional(),
    status: z.string().optional(),
  })

  type SortFormData = z.TypeOf<typeof SortSchema>

  const sortQuery = useQuery(
    ['donated_datasets.getDatasets'],
    async (data: SortFormData) => async () =>
      await trpc(fetch).query('donated_datasets.getDatasets', data)
  )

  const handleClick = (newValue: SortFormData) => {
    value = newValue
  }

  const options = [
    {
      label: 'Name',
      value: { order: 'Name', sort: 'desc' },
    },
    {
      label: '# Instances',
      value: { order: 'NumInstances', sort: 'desc' },
    },
    {
      label: '# Views',
      value: { order: 'NumHits', sort: 'desc' },
    },
    {
      label: '# Attributes',
      value: { order: 'NumAttributes', sort: 'desc' },
    },
    {
      label: 'Date Donated',
      value: { order: 'DateDonated', sort: 'desc' },
    },
  ]

  $: console.log(value)
</script>

<div class="dropdown">
  <label for="" tabindex="0" class="btn btn-sm btn-primary flex gap-2 flex-wrap h-fit">
    <!-- label for the sort button-->
    <div class="flex items-center gap-2">
      <SortIcon />
      <span>Sort By </span>
    </div>
    <div
      use:collapse={{ open: value !== '', horizontal: true }}
      class="overflow-hidden flex transition-all"
    >
      <span>
        {value}
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
        on:click|preventDefault|stopPropagation={() => handleClick(option.value)}
        class="btn cursor-pointer btn-sm rounded-none text-left"
        class:btn-ghost={option.value !== value}
        class:btn-secondary={option.value === value}
      >
        {option.label}
      </li>
    {/each}
  </ul>
</div>
