<script lang="ts">
  import Searchbar from './Searchbar.svelte'
  import NavLinks from './NavLinks.svelte'
  import Profile from './Profile.svelte'

  import ProfileIcon from '$components/Icons/Profile.svelte'
  import SearchIcon from '$components/Icons/Search.svelte'
  import HamburgerIcon from '$components/Icons/Hamburger.svelte'
  import CloseIcon from '$components/Icons/X.svelte'
  import Logo from '$components/Icons/Logo.svelte'

  import { user } from '$lib/stores'

  let searchOpen = false

  const closeSearchbar = () => {
    searchOpen = false
  }
</script>

<svelte:window on:resize={closeSearchbar} />

<nav class="navbar bg-base-100 drop-shadow-md z-10">
  <!-- left side of navbar, will either have searchbar or logo button depending if searchbar is expanded -->
  {#if searchOpen}
    <Searchbar bind:open={searchOpen} />
  {:else}
    <div class="navbar-start">
      <a href="/" class="btn btn-ghost" aria-label="Home">
        <Logo />
      </a>
    </div>
  {/if}

  <!-- center of navbar, navigation links -->
  <div class="navbar-center">
    <NavLinks />
  </div>

  <!-- right side of navbar, profile icon or sidebar toggle -->
  <div class="flex justify-end gap-3" class:navbar-end={!searchOpen}>
    <!-- searchbar input toggle -->
    <div class="form-control w-full flex justify-end">
      <!-- if search bar is closed on small screen, display icon button to expand it -->
      {#if !searchOpen}
        <div class="sm:hidden flex justify-end" on:click={() => (searchOpen = !searchOpen)}>
          <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
            <SearchIcon />
          </button>
        </div>
      {/if}

      <!-- hide the search bar on a small screen by default -->
      <div class="hidden sm:flex">
        <Searchbar />
      </div>
    </div>

    {#if $user.ID != null}
      <!-- profile icon and dropdown menu if logged in, otherwise login link-->
      <Profile />
    {:else}
      <a
        href="/login"
        class="text-xl text-primary font-semibold flex gap-2 items-center hover:underline"
      >
        <ProfileIcon />
        <span> Login </span>
      </a>
    {/if}

    <!-- sidebar/drawer toggle -->
    <label
      for="sidebar"
      class="btn btn-ghost btn-circle text-primary swap swap-rotate md:hidden"
    >
      <input
        id="sidebar-nav"
        type="checkbox"
        aria-labelledby="sidebar-nav-label"
        aria-label="sidebar_toggle"
      />
      <HamburgerIcon class="swap-off" />
      <CloseIcon class="swap-on" />
    </label>
  </div>
</nav>
