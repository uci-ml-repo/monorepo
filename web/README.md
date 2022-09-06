# UCI ML Repository Website

Full stack website built with...

_front-end libraries_

- [Svelte --> frontend UI library](https://svelte.dev/)
- [Sveltekit --> full stack framework for Svelte](https://kit.svelte.dev/)
- [TypeScript --> JavaScript with static type-checking](https://www.typescriptlang.org/)
- [TailwindCSS --> CSS framework](https://tailwindcss.com/)
- [DaisyUI --> component library for TailwindCSS](https://daisyui.com/)
- [MDsveX --> markdown preprocessor for Svelte](https://mdsvex.com/)
- [Stylus --> CSS preprocessor, used in static Markdown content](https://stylus-lang.com/)
- [Jspreadsheet/Jexcel --> a poorly documented spreadsheet library](https://github.com/jspreadsheet/ce)
- [Papaparse --> CSV parsing](https://www.papaparse.com/)
- [Felte --> form builder for Svelte](https://felte.dev/docs/svelte/getting-started)
- [FontAwesome --> free SVG icons](https://fontawesome.com/)

_API libraries_

- [tRPC --> type-safe API development](https://trpc.io/)
- [Svelte-Query --> server-side state management](https://sveltequery.vercel.app/)
- [Zod --> schema validation for form data, API requests, etc.](https://github.com/colinhacks/zod)

_back-end libraries used by Sveltekit (others are used by the server when standalone)_

- [Prisma ORM --> type-safe database ORM, works well with tRPC ](https://www.prisma.io/)
- [Nodemailer --> email communication with users](https://nodemailer.com/about/)

_miscellaneous_

- [Prettier --> code formatting](https://prettier.io/)
- [ESLint --> code quality, static checking](https://eslint.org/)

## File/Directory Overview (coming soon...)

<pre>
.
├── build --> default output directory for "vite build"
│
│
├── <a href="https://kit.svelte.dev/docs/project-structure#project-files">src</a>
│   ├── app.css --> sets up TailwindCSS and global styles
│   ├── app.html --> default "template" for Sveltekit config
│   ├── components --> isolated Svelte components
│   ├── global.d.ts --> global TypeScript definitions
│   ├── <a href="https://kit.svelte.dev/docs/hooks">hooks.ts --> functions that can intercept server requests</a>
│   ├── <a href="https://kit.svelte.dev/docs/modules#$lib">lib --> utilities, actions, programmatic functionality, etc.</a>
│   ├── markdown --> static content
│   └── routes --> file based routing
│
│
├── package.json
├── <a href="https://github.com/postcss/postcss">postcss.config.cjs --> config for PostCSS, needed to compiled TailwindCSS</a>
├── <a href="https://kit.svelte.dev/docs/configuration">svelte.config.js --> config for Sveltekit</a>
├── <a href="https://tailwindcss.com/docs/configuration">tailwind.config.cjs --> config for TailwindCSS and DaisyUI</a>
├── <a href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">tsconfig.json --> TypeScript configuration</a>
└── <a href="https://vitejs.dev/config/">vite.config.ts --> config for Vite, module bundler for Sveltekit</a>
</pre>
