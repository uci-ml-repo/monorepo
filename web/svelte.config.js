import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */

export default {
  preprocess: preprocess({
    postcss: true,
  }),
  kit: {
    alias: {
      $components: 'src/components',
    },
    adapter: adapter(),
  },
}
