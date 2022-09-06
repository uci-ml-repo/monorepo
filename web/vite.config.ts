import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // enable Vite to build Sveltekit app
    sveltekit(),

    // generate a "stats.html" static page that will visualize the application bundle
    visualizer(),
  ],
  ssr: {
    // issue with bundling Felte, might be something related to https://github.com/pablo-abc/felte/issues/112
    noExternal: ['@felte/common', '@felte/core'],
  },
})
