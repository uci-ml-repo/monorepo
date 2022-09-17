<script lang="ts">
  import { collapse } from '$lib/actions'
  import SortIcon from '$components/Icons/Sort.svelte'
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  let sort: 'asc' | 'desc' = 'asc'

  type OrderOption =
    | 'NumHits'
    | 'DateDonated'
    | 'NumInstances'
    | 'Name'
    | 'NumAttributes'
    | undefined

  interface SortOption {
    label: string
    value: OrderOption
  }

  let label = ''
  let order: OrderOption

  const query = useQuery(
    ['donated_datasets.getDatasets'],
    async () =>
      await trpc(fetch).query('donated_datasets.getDatasets', {
        order,
        sort,
      })
  )

  const handleClick = (newSort: SortOption) => {
    label = label === newSort.label ? '' : newSort.label

    if (Boolean(newSort.value)) {
      order = order === newSort.value ? undefined : newSort.value
      $query.refetch()
    }
  }

  $: console.log($query.data)

  const options: SortOption[] = [
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
      <SortIcon class="fill-primary-content" />
      <span>Sort By </span>
    </div>
    <div
      use:collapse={{ open: Boolean(label), horizontal: true }}
      class="overflow-hidden flex transition-all whitespace-nowrap"
    >
      {label || ''}
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
        class:btn-ghost={option.value !== order}
        class:btn-secondary={option.value === order}
      >
        {option.label}
      </li>
    {/each}
  </ul>
</div>
