// enable importing md and svx files, doesn't do file system autocomplete for some reason
declare module '*.md'
declare module '*.svx'

// declare custom use:actions here
declare namespace svelte.JSX {
  interface HTMLAttributes {
    onoutside_click?: () => void
  }
}

// allow importing font awesome icons
declare module '@fortawesome/free-solid-svg-icons/index.es' {
  export * from '@fortawesome/free-solid-svg-icons'
}
