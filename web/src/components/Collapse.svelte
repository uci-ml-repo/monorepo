<script lang="ts">
  // parent component can bind to the collapse open and control the state
  export let collapseOpen = false

  import type { TransitionConfig } from 'svelte/transition'

  // collapse will attempt to infer the closed size, but can close all the way
  export let completeClose = false

  export let duration = 300

  // bind the base height to the closed state
  let baseHeight = 0

  // internal variable to synchronize the collapse contents opening/closing
  // it should close only after the parent has finished closing,
  // and open immediately when the parent begins opens
  let collapseContentOpen = false

  // expand the collapse: gradually increase the height property as t increases
  // when beginning the transition, immediately hide the collapse content
  const collapseIn = (node: HTMLElement, {}): TransitionConfig => {
    return {
      duration,
      tick: (t) => {
        if (t === 0) {
          collapseContentOpen = false
        }
        node.style.height = `${t * node.scrollHeight}px`
      },
    }
  }

  // expand the collapse: gradually decrease the height property as t increases
  // after the transition ends, then show the collapsed content
  const collapseOut = (node: HTMLElement, {}): TransitionConfig => {
    return {
      duration,
      tick: (t) => {
        if (t === 0) {
          collapseContentOpen = true
        }
        node.style.height = `${t * node.scrollHeight + baseHeight}px`
      },
    }
  }
</script>

{#if collapseContentOpen}
  <div
    class="clamp"
    style="height: {completeClose ? 0 : 'auto'}"
    bind:offsetHeight={baseHeight}
  >
    <slot />
  </div>
{/if}

{#if collapseOpen}
  <div in:collapseIn out:collapseOut>
    <slot />
  </div>
{/if}

<style>
  .clamp :global(p) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  div {
    overflow: hidden;
  }
</style>
