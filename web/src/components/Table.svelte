<script lang="ts">
  export let data: (string | number | boolean)[][] = []
  export let headers: string[] = []
</script>

<div class="overflow-x-auto">
  <table class="table w-full my-4">
    <!-- head -->
    <thead>
      <tr>
        {#each headers as header}
          <td class="bg-secondary">{header}</td>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as columns}
        <tr>
          {#each columns as column}
            <td>{column}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
