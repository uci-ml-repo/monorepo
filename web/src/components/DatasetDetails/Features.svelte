<script lang="ts">
  import Table from '$components/Table.svelte'

  const headers = ['Attribute Name', 'Role', 'Type', 'Description', 'Units', 'Missing Values']
</script>

<Table {headers} />
