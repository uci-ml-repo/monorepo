<script lang="ts">
  export let value = ''
  export let minRows = 5
  export let maxRows = 69

  export let name = ''

  const handlePropagation = (event: KeyboardEvent) => {
    // for some reason this causes an error to be console logged if it isn't stopped
    if (event.key === 'Enter') {
      event.stopPropagation()
    }
  }

  $: minHeight = `${1 + minRows * 1.2}em`
  $: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`
</script>

<div class="container relative">
  <pre
    aria-hidden="true"
    style="min-height: {minHeight}; max-height: {maxHeight}"
    class="overflow-hidden">{value + '\n'}</pre>

  <textarea
    {name}
    bind:value
    on:keydown={handlePropagation}
    class="input input-bordered absolute w-full h-full top-0 resize-none"
  />
</div>
