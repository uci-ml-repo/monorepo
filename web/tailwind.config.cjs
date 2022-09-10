/** @type {import('tailwindcss').Config} */

module.exports = {
  // places where TailwindCSS classes might be used
  content: ['./src/**/*.{svelte,js,ts,html}'],

  daisyui: {
    // which themes should be enabled/modified from the default selection
    // set with the "data-theme" property in any HTML tag, e.g. in app.html
    themes: [
      // some fun default themes
      'cupcake',
      'synthwave',
      'luxury',
      'valentine',
      {
        // main, custom UCI theme: https://brand.uci.edu/master-branding/color-palette/
        uci: {
          primary: '#0064A4', // UCI Blue
          secondary: '#FFD200', // UCI Gold
          accent: '#f78d2d', // Orange
          neutral: '#E0F2FE',
          'base-100': '#FFFFFF',
          info: '#93E6FB',
          success: '#80CED1',
          warning: '#EFD8BD',
          error: '#E58B8B',
        },
      },
    ],
  },

  // plugins to extend base TailwindCSS classes
  plugins: [
    // enable DaisyUI, a component library for TailwindCSS
    require('daisyui'),

    // enable some extra utility classes for line clamping
    require('@tailwindcss/line-clamp'),

    // Typography styling, useful for Markdown
    require('@tailwindcss/typography'),
  ],
}
