<script lang="ts">
  import VirtualList from './VirtualList.svelte'
  export let isOpen = false
  export let options: string[] = []
  export let isAbsolute = true

  export let height = '240px'

  // don't bind to searchValue, just pass it in as a prop and allow this
  // component to produce the correct options
  export let searchValue = ''

  $: filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  )
</script>

<div
  tabindex="0"
  class="w-full top-full collapse border-base-300 bg-base-100"
  class:collapse-open={isOpen}
  class:absolute={isAbsolute}
  class:border={isOpen}
>
  <div class="collapse-content p-0">
    <slot name="above" />
    <!-- default slot allows you to wrap the virtual list -->
    <VirtualList {height} items={filteredOptions} let:item>
      <slot name="list-item" {item}>
        {item}
      </slot>
    </VirtualList>
  </div>
</div>
