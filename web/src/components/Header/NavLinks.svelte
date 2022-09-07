<script lang="ts">
  import CaretIcon from '$components/Icons/Caret.svelte'
</script>

<!-- navlinks will disappear on smaller screens -->
<ul tabindex="0" class="menu menu-horizontal text-primary hidden md:flex">
  <li><a href="/datasets">Datasets</a></li>

  <!-- show all options for lg screens -->
  <li class="dropdown dropdown-hover">
    <a href="/">
      <a href="/" class="hidden lg:block"> Donate a Dataset </a>
      <a href="/" class="lg:hidden"> Contribute a Dataset </a>
      <CaretIcon class="rotate-90 block lg:hidden" />
    </a>

    <!-- show a dropdown for screens smaller than lg -->
    <ul tabindex="0" class="lg:hidden dropdown-content menu p-2 w-52 shadow bg-base-100">
      <li><a href="/">Donate a Dataset</a></li>
      <li><a href="/">Link an External Dataset</a></li>
    </ul>
  </li>

  <!-- "link a dataset" will show up under the dropdown if smaller than lg -->
  <li class="hidden lg:block"><a href="/">Link an External Dataset</a></li>
</ul>
