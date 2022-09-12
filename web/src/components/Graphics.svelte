<script lang="ts">
  /*
     this component literally just renders an image,
     but it does some gymnastics to allow a fallback image

     no image specific props are specified;
     just treat this as an image and forward all the props you want, e.g.
     src, alt, class, etc.
   */

  // parent can pass in a custom fallback; should be a valid "src" value
  export let fallbackSrc = '/ml/datasets/default/SmallLarge.jpg'

  // for some reason Svelte's "on:error" doesn't actually get invoked on page load,
  // I've only seen it get invoked during hot module reloading
  // so this component uses the native onerror HTML attribute to set its src to the fallback
  // cast to unknown and then to some random type so TypeScript doesn't get mad lol
  export const fallbackImage = `this.src="${fallbackSrc}"` as unknown as null
</script>

<img alt="custom-graphic" onerror={fallbackImage} {...$$props} />
