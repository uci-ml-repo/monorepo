<script lang="ts">
  import { onMount } from 'svelte'
  export { extra_classes as class }

  import { collapse } from '$lib/actions'
  import CaretIcon from '$components/Icons/Caret.svelte'

  let extra_classes = ''
  let open = false

  let element: HTMLElement
  let lineHeight = 24

  const toggleOpen = () => {
    open = !open
  }

  $: needExpand = element?.scrollHeight > 2 * lineHeight

  const recalculateHeight = () => {
    lineHeight = parseInt(window.getComputedStyle(element).getPropertyValue('line-height'))
    needExpand = element?.scrollHeight > 2 * lineHeight
  }

  onMount(() => {
    recalculateHeight()
    window.addEventListener('resize', recalculateHeight)
    return () => window.removeEventListener('resize', recalculateHeight)
  })
</script>

<div class={extra_classes} use:collapse={{ open }} bind:this={element}>
  <slot />
</div>

<!-- dropdown text can also accept a button to trigger open or close -->
<!-- nest a child under the button slot to override the button -->
{#if needExpand}
  <div on:click={toggleOpen}>
    <slot name="button" {open}>
      <button class="btn btn-ghost flex gap-4 -ml-4">
        <span>
          {#if open}
            Show Less
          {:else}
            Show More
          {/if}
        </span>
        <CaretIcon {open} />
      </button>
    </slot>
  </div>
{/if}
