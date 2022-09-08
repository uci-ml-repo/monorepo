import type { ActionReturn } from 'svelte/action'

interface CollapseParams {
  open: boolean
  lineClamp?: number
  baseHeight?: number
}

export default function collapse(node: HTMLElement, params: CollapseParams): ActionReturn {
  // configuration for the collapse
  const lineHeight = parseInt(window.getComputedStyle(node).getPropertyValue('line-height'))
  const scrollHeight = node.scrollHeight
  const lineClamp = params.lineClamp ?? 2
  const baseHeight = params.baseHeight
    ? params.baseHeight + 'px'
    : lineClamp * lineHeight + 'px'

  // apply styles to the node
  node.style.webkitLineClamp = lineClamp.toString()
  node.style.webkitBoxOrient = 'vertical'
  node.style.overflow = 'hidden'
  node.style.transition = 'all 500ms'

  return {
    update: (params: CollapseParams) => {
      if (params.open) {
        node.style.height = scrollHeight + 'px'
        node.style.display = 'block'
      } else {
        node.style.height = baseHeight
        node.style.display = '-webkit-box'
      }
    },
  }
}
