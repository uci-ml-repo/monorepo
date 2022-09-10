<script lang="ts">
  import PageRight from '$components/Icons/PageRight.svelte'
  import PageLeft from '$components/Icons/PageLeft.svelte'

  export let rowsPerPageOptions = [10, 25, 50, 100, 250, 500]
  export let data: unknown[] = []
  export let currentPage = 0
  export let rowsPerPage = rowsPerPageOptions[0]

  $: maxPage = data?.length / rowsPerPage - 1

  let nextPage = () => {
    if (currentPage < maxPage) {
      currentPage += 1
    }
  }

  let prevPage = () => {
    if (currentPage > 0) {
      currentPage -= 1
    }
  }
</script>

<div class="flex flex-col md:flex-row w-full justify-end p-2">
  <!-- pagination options -->
  <div class="flex justify-center sm:justify-end gap-4 items-center flex-wrap">
    <div class="flex justify-evenly items-center gap-6">
      <span>Rows per Page</span>
      <select
        class="select select-sm select-bordered w-20"
        bind:value={rowsPerPage}
        aria-label="select-rows-per-page"
      >
        {#each rowsPerPageOptions as option}
          <option>{option}</option>
        {/each}
      </select>
      <span class="text-sm">
        <span>{currentPage * rowsPerPage + 1}</span>
        to <span>{Math.min((currentPage + 1) * rowsPerPage, data.length)}</span> of
        <span>{data?.length || 0}</span>
      </span>
    </div>
    <div class="btn-group grid grid-cols-2">
      <button
        class="btn btn-ghost btn-circle btn-sm"
        on:click={prevPage}
        disabled={currentPage === 0}
        aria-label="previous"
      >
        <PageLeft />
      </button>
      <button
        class="btn btn-ghost btn-circle btn-sm"
        on:click={nextPage}
        disabled={currentPage >= maxPage}
        aria-label="next"
      >
        <PageRight />
      </button>
    </div>
  </div>
</div>
