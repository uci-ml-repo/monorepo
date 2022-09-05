<script>
  // accept front matter from the Markdown (.md, .svx) files as props
  export let title
</script>

<div id="Layout-default" class="max-w-[960px] mx-auto">
  {#if title}
    <h1 class="text-3xl bg-primary text-secondary text-center">{title}</h1>
  {/if}
  <slot />
</div>

<style lang="stylus">
  #Layout-default :global(p)
    @apply bg-secondary
</style>
