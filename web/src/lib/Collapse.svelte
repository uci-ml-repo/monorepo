<script lang="ts">
  import { collapse } from './actions'

  // content below the list title
  export let contentOpen = false

  // content inside the list title
  export let iconOpen = false

  const toggleOpen = () => {
    contentOpen = !contentOpen
  }
</script>

<button on:click|preventDefault={toggleOpen} class="btn btn-secondary">toggle open</button>
<div class="btn btn-ghost flex gap-4 border border-primary">
  <!-- since this starts out closed, inline style with width: 0 and make sure to overflow-hidden -->
  <!-- the inline style will be overriden by use:collapse on toggle -->
  <div use:collapse={{ open: contentOpen, horizontal: true }} class="overflow-hidden w-0">
    <input type="checkbox" class="checkbox checkbox-accent" bind:checked={iconOpen} />
    <slot name="collapse-title-content" />
  </div>
  <h1>Subject Area</h1>
  <slot name="collapse-title" />
</div>
<div use:collapse={{ open: iconOpen }} class="overflow-hidden w-96 h-0">
  Amet corrupti perspiciatis dicta atque repellendus error Delectus rerum necessitatibus
  similique minima impedit blanditiis. Perspiciatis facere officia velit vitae beatae
  Recusandae nostrum fugit quia ad ea! Provident molestias debitis repellat eius pariatur,
  perspiciatis Placeat necessitatibus reiciendis labore aspernatur corrupti. Quos quis harum
  quo ut atque Sint temporibus voluptate libero beatae.
  <slot name="collapse-content" />
</div>
