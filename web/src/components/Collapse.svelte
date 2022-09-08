<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition'
  import Caret from './Icons/Caret.svelte'

  // parent component can bind to the collapse open and control the state
  export let collapseOpen = false

  // collapse will attempt to infer the closed size, but can close all the way
  export let completeClose = false

  // can display a caret
  export let withCaret = false

  export let duration = 250

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

  const toggleClose = () => {
    collapseOpen = !collapseOpen
  }
</script>

<!-- a parent component, e.g. a list button, can be passed as the toggle trigger -->
{#if $$slots.parent}
  <div class="flex justify-between btn btn-ghost w-full" on:click|preventDefault={toggleClose}>
    <slot name="parent" />
    <Caret open={collapseOpen} />
  </div>
{/if}

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
