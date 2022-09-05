<script>
  // accept front matter from the Markdown (.md, .svx) files as props
  export let title
</script>

{#if title}
  <h1 class="text-3xl bg-primary text-secondary text-center">{title}</h1>
{/if}

<slot />
