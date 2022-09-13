<script lang="ts">
  import ProfileIcon from '$components/Icons/Profile.svelte'
</script>

<div class="dropdown dropdown-end">
  <label
    tabindex="0"
    for="profile"
    class="btn btn-ghost btn-circle text-primary hidden md:flex"
  >
    <ProfileIcon />
  </label>
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a href="/profile">Profile</a></li>
    <li><a href="/admin">Admin Dashboard</a></li>
    <li><a href="/">Logout</a></li>
  </ul>
</div>
