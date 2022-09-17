<script lang="ts">
  import CaretIcon from './Icons/Caret.svelte'
  import { collapse } from '$lib/actions'
  export let open = false

  const toggleOpen = () => (open = !open)
</script>

<div class="shadow pb-4">
  <div on:click={toggleOpen}>
    <span class="w-full cursor-pointer btn-ghost flex justify-between items-center p-4">
      <!-- title slot is a button that can toggle the accordion open state -->
      <slot name="title" {open} />

      <!-- accordion has an arrow that points when open or closed next to the title -->
      <CaretIcon {open} />
    </span>
  </div>

  <!-- collapse content to display below the list item button -->
  <div use:collapse={{ open, baseHeight: 0 }} class="overflow-hidden h-0 px-4">
    <slot name="content" {open} />
  </div>
</div>
