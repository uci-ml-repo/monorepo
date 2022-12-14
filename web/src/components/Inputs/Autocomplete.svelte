<script lang="ts">
  import { clickOutside } from '$lib/actions'
  import VirtualList from '$components/UI/VirtualList.svelte'
  import XIcon from '$components/Icons/X.svelte'
  import CaretIcon from '$components/Icons/Caret.svelte'

  // pre-determined options for the dropdown autocomplete
  // can either provide an array of strings or an array of label/value objects
  type ValueType = string | number
  type OptionType = ValueType | { label: string; value: ValueType }

  // bind props
  //////////////////////////////////////////

  // option list
  export let options: OptionType[] = []

  // search value to filter the option list by
  export let search = ''

  // reactively shows options matching the search
  export let selected: OptionType[] = []

  // reactively shows the actual selected values (e.g. not the label/value objects)
  export let selectedValues: ValueType[] = []

  // whenever selected changes, update the selected values
  $: selectedValues = selected.map((v) => getValue(v))

  // behavior props
  //////////////////////////////////////////

  // select multiple options and render them as removable chips
  export let multiple = false

  // allow any input to be entered and added to the selected list
  export let freeSolo = false

  // whenever options changes, update the filtered options,
  // which are just the values used to compare with the search input
  $: filteredOptions = options.filter((option) => {
    // match the search input with **LABELS** not values
    const label = getLabel(option).toString().toLowerCase()
    return label.includes(search)
  })

  // utilities
  //////////////////////////////////////////
  const getLabel = (value: OptionType) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value
    } else {
      return value.label
    }
  }

  const getValue = (value: OptionType) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value
    } else {
      return value.value
    }
  }

  // reactively determines if a value in the dropdown menu is selected
  $: isSelected = (value: OptionType) => {
    return selected.some((v) => getValue(v) === getValue(value))
  }

  // state management for dropdown open/close
  //////////////////////////////////////////
  let autocompleteOpen = false

  const openAutocomplete = () => (autocompleteOpen = true)
  const closeAutocomplete = () => (autocompleteOpen = false)
  const toggleAutocomplete = () => (autocompleteOpen = !autocompleteOpen)

  // state management for multiple options
  //////////////////////////////////////////
  const removeSelected = (value: OptionType) => {
    selected = selected.filter((v) => getValue(v) !== getValue(value))
  }

  const toggleSelected = (value: OptionType) => {
    if (isSelected(value)) {
      selected = selected.filter((v) => getValue(v) !== getValue(value))
    } else {
      selected = [...selected, value]
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // only enable custom values from the text input if freeSolo enabled
    // ** SHOULD ONLY DO THIS IF WORKING WITH STRINGS, NOT { label, value } objects
    if (e.key === 'Enter' && freeSolo) {
      selected = [...selected, search]
      search = ''
    }
    if (e.key === 'Escape') {
      closeAutocomplete()
    }
  }
</script>

<!-- use the svelte window component to handle keypresses -->
<svelte:window on:keydown={handleKeyDown} />

<!-- this entire component looks like a searchbar, but has an autocomplete and many subcomponents -->
<!-- borders wrap around certain divs to give the illusion that it's the real text input -->
<!-- remount the component if the options change -->
{#key options}
  <div
    class={`relative w-full px-0 border border-primary rounded-sm px-4`}
    use:clickOutside
    on:outside_click={closeAutocomplete}
  >
    <div class="relative w-full h-full overflow-visible">
      <label
        for="keyword-add-dropdown"
        class="p-4 w-full h-full flex gap-1 flex-wrap max-h-[120px] overflow-y-auto cursor-text"
        on:click={openAutocomplete}
      >
        <!-- if can select multiple, show each selected option as a chip -->
        {#if multiple}
          {#each selected as option}
            <!-- can replace the chips/badges with a different UI component to represent selected -->
            <slot name="indicator" {option}>
              <!-- by default, badge/chip with an X to represent multiple selected options-->
              <div class="badge badge-xs badge-primary h-8 flex items-center">
                <button
                  class="btn btn-ghost btn-xs btn-circle"
                  on:click={() => removeSelected(option)}
                >
                  <XIcon class="h-full fill-red-500" />
                </button>
                <span class="text-white">
                  {getLabel(option)}
                </span>
              </div>
            </slot>
          {/each}
        {/if}

        <!-- search input -->
        <input
          id="keyword-add-dropdown"
          type="text"
          class="w-11/12 h-full outline-none bg-transparent"
          aria-label="search-input"
          bind:value={search}
        />

        <!-- caret icon button; toggles the dropdown -->
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-0 bottom-1/4 right-1"
          type="button"
          on:click|preventDefault|stopPropagation={toggleAutocomplete}
        >
          <CaretIcon open={autocompleteOpen} />
        </button>
      </label>

      <!-- matching options displayed in a virtual list to improve performance -->
      <div
        tabindex="0"
        class="w-full top-full collapse border-base-300 bg-base-100 absolute"
        class:collapse-open={autocompleteOpen}
        class:border={autocompleteOpen}
      >
        <div class="collapse-content p-0">
          <VirtualList height="240px" items={filteredOptions} let:item>
            <slot name="list-item" {item} {toggleSelected}>
              <!-- if selecting multiple, render a span that darkens if its selected -->
              {#if multiple}
                <span
                  tabindex="0"
                  class="hover:bg-base-200"
                  on:click|preventDefault={() => toggleSelected(item)}
                  class:bg-base-200={isSelected(item)}
                >
                  {getLabel(item)}
                </span>

                <!-- if not selecting multiple, render a span that darkens on hover -->
              {:else}
                <span class="hover:bg-base-200" tabindex="0">
                  {getLabel(item)}
                </span>
              {/if}
            </slot>
          </VirtualList>
        </div>
      </div>
    </div>
  </div>
{/key}
