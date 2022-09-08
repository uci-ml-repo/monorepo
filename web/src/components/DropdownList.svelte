<script>
  import { collapse } from '$lib/actions'
  import Caret from '$components/Icons/Caret.svelte'

  let open = false
  const toggleOpen = () => {
    open = !open
  }
</script>

<button on:click|preventDefault={toggleOpen} class="btn btn-ghost flex justify-between">
  <!-- a start icon can appear and disappear dynamically -->
  <div use:collapse>
    <slot name="start-icon" />
  </div>
  <div use:collapse />
  <Caret {open} />
</button>

<div use:collapse={{ open, baseHeight: 0 }}>
  <slot />
</div>
