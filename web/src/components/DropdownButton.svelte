<script lang="ts">
  import { collapse } from '$lib/actions'

  import Caret from './Icons/Caret.svelte'

  export let contentOpen = false

  // icon to the left of the title slot
  export let startIconOpen = false

  // icon to the right of the title slot
  export let endIconOpen = false

  const toggleContent = () => {
    contentOpen = !contentOpen
  }
</script>

<div class="btn btn-ghost flex justify-between px-2" on:click={toggleContent}>
  <!-- optional icon to the left of the title, bind to the open to control its visiblity -->
  <div use:collapse={{ open: startIconOpen, horizontal: true }} class="overflow-hidden w-0">
    <slot name="start-icon" />
  </div>

  <!-- main title in the center -->
  <div class="flex-1 flex items-center justify-between w-full px-4">
    <slot name="title" />
    <Caret open={contentOpen} />
  </div>

  <!-- optional icon to the right of the title, bind to the open to control its visiblity -->
  <div use:collapse={{ open: endIconOpen, horizontal: true }} class="overflow-hidden w-0">
    <slot name="end-icon" />
  </div>
</div>

<!-- collapse content to display below the list item button -->
<div use:collapse={{ open: contentOpen, baseHeight: 0 }} class="overflow-hidden h-0 px-4">
  <slot name="content" />
</div>
