export function clickOutside(node: HTMLElement) {
  const handleClick = (event: KeyboardEvent) => {
    if (!node.contains(event.target as HTMLInputElement)) {
      node.dispatchEvent(new CustomEvent('outside_click'))
    }
  }

  document.addEventListener('click', handleClick, true)

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    },
  }
}
