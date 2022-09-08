<script lang="ts">
  import Collapse from '$lib/Collapse.svelte'

  export let contentOpen = false

  // icon to the left of the title slot
  export let startIconOpen = false

  // icon to the right of the title slot
  export let endIconOpen = false
</script>

<button class="btn btn-accent" on:click|preventDefault={() => (startIconOpen = !startIconOpen)}
  >toggle start checkbox</button
>
<button class="btn btn-secondary" on:click|preventDefault={() => (endIconOpen = !endIconOpen)}
  >toggle end checkbox</button
>

<Collapse {...{ startIconOpen, endIconOpen, contentOpen }}>
  <input
    slot="start-icon"
    type="checkbox"
    class="checkbox"
    bind:checked={contentOpen}
    on:click|stopPropagation={() => console.log('checked')}
  />
  <h1 slot="title">List Title (toggle collapse content</h1>
  <input
    slot="end-icon"
    type="checkbox"
    class="checkbox"
    bind:checked={contentOpen}
    on:click|stopPropagation={() => console.log('checked')}
  />
  <p slot="content">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non, dolorem iusto voluptatum
    quis quisquam nam vel corporis temporibus reprehenderit quasi dolor labore, optio, mollitia
    itaque veritatis impedit laudantium est amet ratione unde debitis commodi doloremque
    quaerat! Dolor beatae magni, provident aliquid tempora nemo eos laboriosam temporibus
    soluta reprehenderit officia earum nulla? Earum cum labore provident? Maxime saepe
    voluptatum, reprehenderit excepturi molestias praesentium quae ullam consequuntur modi
    aspernatur deleniti quibusdam?
  </p>
</Collapse>
