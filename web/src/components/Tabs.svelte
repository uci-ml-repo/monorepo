<script lang="ts">
  import { tabs } from '$lib/actions'

  interface TabOption {
    label: string
    value: unknown
  }

  // parent component can pass in options, default is an example
  export let options: TabOption[] = [
    {
      label: 'Option 1',
      value: 1,
    },
    {
      label: 'Option 2',
      value: 1,
    },
    {
      label: 'Option 3',
      value: 1,
    },
    {
      label: 'Option 4',
      value: 1,
    },
  ]

  // parent can bind to the value of the tabs
  export let value = options[0].value

  // index of active tab
  let active = 0

  const setActive = (newActive: number) => {
    active = newActive
    value = options[newActive].value
  }
</script>

<!-- tab parent aligns all tabs to left by default for the position relative/absolute to work -->
<!-- but they can be wrapped in a flex box and justified to the desired position -->
<div class="max-w-full overflow-auto">
  <div use:tabs={{ active }} class="flex tab-parent mx-auto">
    {#each options as option, index}
      <div
        class="tab-option hover:bg-base-200 p-2 cursor-pointer"
        on:click={() => setActive(index)}
      >
        <span class="text-xl whitespace-nowrap" class:text-primary={active === index}
          >{option.label}</span
        >
      </div>
    {/each}
  </div>
</div>

<style lang="stylus">
  /* override the thicc scrollbar settings from the root */
  *::-webkit-scrollbar {
    @apply h-1 w-1 bg-base-100;
  }

  *::-webkit-scrollbar-thumb {
    @apply bg-base-200 rounded-full;
  }
</style>
