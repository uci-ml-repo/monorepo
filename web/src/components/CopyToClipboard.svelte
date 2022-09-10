<script lang="ts">
  export let value = ''

  import CopyIcon from '$components/Icons/Copy.svelte'
  import CheckIcon from '$components/Icons/Check.svelte'

  const defaultTooltip = 'Copy citation'
  const activeTooltip = 'Copied!'

  // tooltip when displays hovering over the copy to clipboard button
  // switches between active and default states
  let tooltip = defaultTooltip

  // button will remain in an active state after clicked until mouse leaves
  let active = false

  // wait for a second before resetting the tool tip,
  // but cancel the reset if user re-hovers too early
  let activeTimeout: ReturnType<typeof setTimeout>

  const copy = () => {
    navigator.clipboard.writeText(value)
    tooltip = activeTooltip
    active = true

    if (activeTimeout) {
      clearTimeout(activeTimeout)
    }
    activeTimeout = setTimeout(reset, 1000)
  }

  // for a smoother transition, wait for a second before resetting everything
  const reset = () => {
    tooltip = defaultTooltip
    active = false
  }
</script>

<div class="flex gap-4 items-center indent-0">
  <div class="tooltip" data-tip={tooltip}>
    <!-- can insert a title here-->
    <slot />

    <!-- copy to clipboard buttons -->
    <button on:click={copy} class="btn btn-ghost">
      <!-- the swap class allows 2 children with swap-on and swap-off classes -->
      <!-- the parent will transition between them depending if swap-active is present -->
      <div class="swap" class:swap-active={active}>
        <CheckIcon class="swap-on fill-primary" />
        <CopyIcon class="swap-off fill-primary" />
      </div>
    </button>
  </div>

  <!-- citation in pre tag-->
  <pre class="bg-base-200 whitespace-pre-wrap p-2 w-full h-full">{value}</pre>
</div>
