<script lang="ts">
  import Tabs from '$components/Tabs.svelte'

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
</script>

<div class="mx-auto my-16 border overflow-auto">
  <Tabs {options} class="flex justify-center" />
</div>
