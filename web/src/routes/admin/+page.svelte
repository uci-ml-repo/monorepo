<script lang="ts">
  import Tabs from '$components/Tabs.svelte'

  import Dataset from './Dataset.svelte'
  import Edit from './Edit.svelte'
  import User from './User.svelte'
  import Note from './Note.svelte'
  import Keyword from './Keyword.svelte'

  // tab controls
  //////////////////////////////////////////
  const options = [
    { label: 'Donated Datasets', value: 'donated_datasets' },
    { label: 'Edited Datasets', value: 'edited_datasets' },
    { label: 'Rejected Datasets', value: 'rejected_datasets' },
    { label: 'Accepted Edits', value: 'accepted_edits' },
    { label: 'Rejected Edits', value: 'rejected_edits' },
    { label: 'Keywords', value: 'keywords' },
    { label: 'Notes', value: 'notes' },
    { label: 'Users', value: 'users' },
  ]

  // current tab value
  let value = 'donated_datasets'
</script>

<div class="w-full flex justify-center my-8 overflow-auto">
  <Tabs {options} bind:value />
</div>

{#if value === 'donated_datasets'}
  <Dataset status="PENDING" />
{:else if value === 'edited_datasets'}
  <Dataset status="SUBMITTED" />
{:else if value === 'rejected_datasets'}
  <Dataset status="REJECTED" />
{:else if value === 'accepted_edits'}
  <Edit status="ACCEPTED" />
{:else if value === 'rejected_edits'}
  <Edit status="REJECTED" />
{:else if value === 'users'}
  <User />
{:else if value === 'notes'}
  <Note />
{:else if value === 'keywords'}
  <Keyword />
{/if}
