module.exports = {
  plugins: [
    // build the css required for the tailwind classes
    require('tailwindcss'),

    // add prefixed properties like -webkit to the css classes so they work across browsers
    require('autoprefixer'),
  ],
}
