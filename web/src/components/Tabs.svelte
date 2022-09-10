<script lang="ts">
  // converts tabs to input

  interface TabOption {
    label: string
    value: string
  }

  export let options: TabOption[] = []
  export let value: string = options?.[0]?.value || ''

  const updateValue = (newValue: string) => {
    value = newValue
  }

  let className = ''
  export { className as class }
</script>

<div class="tabs {className}">
  {#each options as option}
    <div
      class="tab tab-bordered tab-lg text-primary"
      on:click={() => updateValue(option.value)}
      class:border-secondary={option.value === value}
    >
      {option.label}
    </div>
  {/each}
</div>
