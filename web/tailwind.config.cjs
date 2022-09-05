/** @type {import('tailwindcss').Config} */

module.exports = {
  // places where tailwind classes might be used
  content: ['./src/**/*.{svelte,js,ts,html}'],

  daisyui: {
    // which themes should be enabled/modified from the default selection
    // set with the "data-theme" property in any html-tag, e.g. in app.html
    themes: [
      // some fun default themes
      'cupcake',
      'synthwave',
      'luxury',
      'valentine',
      {
        // main, custom UCI theme
        uci: {
          primary: '#0064A4',
          secondary: '#FFD200',
          accent: '#C149AD',
          neutral: '#e0f2fe',
          'base-100': '#FFFFFF',
          info: '#93E6FB',
          success: '#80CED1',
          warning: '#EFD8BD',
          error: '#E58B8B',
        },
      },
    ],
  },

  // plugins to extend base tailwind classes
  plugins: [
    // enable DaisyUI, a component library for TailwindCSS
    require('daisyui'),

    // enable some extra utility classes for line clamping
    require('@tailwindcss/line-clamp')
],
}
