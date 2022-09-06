module.exports = {
  plugins: [
    // build the CSS required for the TailwindCSS classes
    require('tailwindcss'),

    // add prefixed properties like -webkit to the css classes so they're cross-browser compatible
    require('autoprefixer'),

    // minify the CSS as much as possible
    require('cssnano'),
  ],
}
