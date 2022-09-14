<script lang="ts">
  import GithubIcon from '$components/Icons/Github.svelte'
</script>

<a href="/login/github" class="btn btn-warning bg-black hover:bg-gray-800 flex gap-4">
  <GithubIcon class="h-5 fill-white" />
  <span class="text-white">
    <slot>Login with Github</slot>
  </span>
</a>
