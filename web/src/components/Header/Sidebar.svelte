<script lang="ts">
  import CloseIcon from '$components/Icons/X.svelte'
</script>

<div class="drawer-side">
  <label for="sidebar" class="drawer-overlay" />
  <div class="menu p-4 overflow-y-auto w-80 bg-base-100">
    <label for="sidebar" class="drawer-overlay btn btn-ghost btn-circle ml-auto">
      <CloseIcon class="fill-red-600" />
    </label>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/">Datasets</a></li>
      <li><a href="/">Donate a Dataset</a></li>
      <li><a href="/">Link an External Dataset</a></li>
      <li><a href="/">Profile</a></li>
      <li><a href="/">Admin Dashboard</a></li>
      <li><a href="/">Logout</a></li>
    </ul>
  </div>
</div>
