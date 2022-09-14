<script lang="ts">
  import GoogleIcon from '$components/Icons/Google.svelte'
</script>

<a href="/login/google" class="btn btn-error bg-red-500 hover:bg-red-400 flex gap-4">
  <GoogleIcon class="h-5 fill-white" />
  <span class="text-white">
    <slot>Login with Google</slot>
  </span>
</a>
