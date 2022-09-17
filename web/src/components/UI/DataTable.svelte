<script lang="ts">
  export let data: { label: string; value: string | number | boolean | null }[][] = []
  export let headers: { key: number; label: string }[] = []

  import Pagination from './Pagination.svelte'

  let rowsPerPage = 2
  let currentPage = 0
  let rowsPerPageOptions = [2, 5, 10]
</script>

<div class="overflow-x-auto">
  <table class="table w-full my-4">
    <!-- head -->
    <thead>
      <tr>
        {#each headers as header}
          <td class="bg-secondary">{header.label}</td>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) as columns}
        <tr>
          {#each columns as column}
            <td>
              <pre class="whitespace-pre-wrap">{column.label}</pre>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <Pagination bind:rowsPerPage bind:currentPage bind:rowsPerPageOptions {data} />
</div>
