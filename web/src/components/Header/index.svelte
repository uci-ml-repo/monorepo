<script lang="ts">
  import Sidebar from './Sidebar.svelte'
  import HeaderBody from './HeaderBody.svelte'
</script>

<!-- entire application is wrapped in a drawer component; e.g. a toggleable fullscreen modal -->
<!-- header can be used standalone, e.g. without a drawer, with HeaderBody -->
<div class="drawer drawer-end">
  <!-- invisible toggle for "sidebar", **this id is really important for toggling without JavaScript-->
  <input
    id="sidebar"
    type="checkbox"
    class="drawer-toggle"
    aria-labelledby="hidden-sidebar-label"
  />
  <label id="hidden-sidebar-label" for="sidebar" class="hidden">Sidebar</label>

  <!-- drawer content contains all the content on the page -->
  <div class="drawer-content flex flex-col">
    <!-- navigation and header -->
    <HeaderBody />

    <!-- rest of the content is slotted here -->
    <slot />
  </div>

  <!-- sidebar content -->
  <Sidebar />
</div>
