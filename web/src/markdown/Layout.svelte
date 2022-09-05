<script>
  // StyledWrapper should mirror this file, but with TailwindCSS styles applied in the style tag
  // an issue with MDX prevents the pre-processed styles in this file: https://github.com/pngwn/MDsveX/issues/116
  import StyledWrapper from './StyledWrapper.svelte'

  // accept front matter from the Markdown (.md, .svx) files as props
  export let title
</script>

<StyledWrapper {title}>
  <slot />
</StyledWrapper>
