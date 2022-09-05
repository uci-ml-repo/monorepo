import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [sveltekit(), visualizer()],
  ssr: {
    noExternal: ['@felte/common', '@felte/core'],
  },
})