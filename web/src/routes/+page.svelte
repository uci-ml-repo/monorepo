<script lang="ts">
  import Spreadsheet from '$components/Spreadsheet/Spreadsheet.svelte'
  import Chart from '$components/Chart.svelte'
</script>

<svelte:head>
  <title>UC Irvine Machine Learning Repository</title>
</svelte:head>

<h1 class="text-3xl text-primary text-center">
  Welcome to the UC Irvine Machine Learning Repository
</h1>

<Spreadsheet />
<Chart />
