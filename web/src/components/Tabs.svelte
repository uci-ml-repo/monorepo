<script lang="ts">
  // converts tabs to input

  interface TabOption {
    label: string
    value: unknown
  }

  export let options: TabOption[] = []
  export let value: unknown = options?.[0]?.value

  const updateValue = (newValue: unknown) => {
    value = newValue
  }

  let className = ''
  export { className as class }
</script>

<div class="tabs {className}">
  {#each options as option}
    <div
      class="tab tab-bordered tab-lg text-primary text-xl"
      on:click={() => updateValue(option.value)}
      class:border-secondary={option.value === value}
    >
      {option.label}
    </div>
  {/each}
</div>
