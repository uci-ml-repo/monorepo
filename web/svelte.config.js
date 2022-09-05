import sveltePreprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import { mdsvex } from 'mdsvex'

import { resolve } from 'path'

// workaround to enable __dirname in esm
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/** @type {import('@sveltejs/kit').Config} */

export default {
  // enable file extensions for MDsveX
  extensions: ['.svelte', '.svx', '.md'],

  preprocess: [
    // specify enabled packages for preprocessing
    sveltePreprocess({
      postcss: true,
      stylus: true,
      typescript: true,
    }),

    // use MDsveX preprocessor for .md (Markdown) and .svx files
    mdsvex({
      extensions: ['.svx', '.md'],
      layout: {
        // default layout for Markdown components
        _: resolve(__dirname, './src/markdown/Layout.svelte'),
      },
    }),
  ],
  kit: {
    alias: {
      // path aliases for the website
      // Svelte components
      $components: 'src/components',

      // Markdown files for static content
      $markdown: 'src/markdown',
    },

    // deploy the app on Node with the Node adapter
    adapter: adapter(),
  },
}
