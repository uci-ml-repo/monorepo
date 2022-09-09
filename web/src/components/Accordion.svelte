<script lang="ts">
  //import CaretIcon from './Icons/Caret.svelte';
  import { collapse } from '$lib/actions'
  export let open = false

  const toggleOpen = () => {
    open = !open
  }
</script>

<div on:click={toggleOpen}>
  <slot name="title" />
</div>

<!-- collapse content to display below the list item button -->
<div use:collapse={{ open, baseHeight: 0 }} class="overflow-hidden h-0 px-4">
  <slot name="content" />
</div>
