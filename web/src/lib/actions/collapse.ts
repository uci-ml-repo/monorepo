import type { ActionReturn } from 'svelte/action'

interface CollapseParams {
  open: boolean
  duration?: number
  lineClamp?: number
  baseHeight?: number
  horizontal?: boolean
}

// prior to using, if the component starts off closed, manually set the
// style (height or width) to the closed size; after collapse mounts, then it will control the inline style
////////////////////////////////////////////
export default function collapse(node: HTMLElement, params: CollapseParams): ActionReturn {
  // height to transition to when collapse closes
  // e.g. line height = 24px and line clamp = 2 means that it will be 48px when closed
  const lineHeight = parseInt(window.getComputedStyle(node).getPropertyValue('line-height'))
  const lineClamp = params.lineClamp ?? 2
  const baseHeight =
    params.baseHeight !== undefined ? params.baseHeight : lineClamp * lineHeight

  // height when collapse is open
  // base height and scroll height are used to set the height properties exactly,
  // which is interpolated by setting a transition
  const scrollHeight = node.scrollHeight

  // width will transition between 0 and the original width
  const baseWidth = 0
  const scrollWidth = node.scrollWidth

  // should set this in the parent component if it starts off closed
  node.style.overflow = 'hidden'

  // utility functions to improve readability
  ////////////////////////////////////////////
  const setHorizontal = (open: boolean) => {
    if (open) {
      node.style.width = scrollWidth + 'px'
    } else {
      node.style.width = baseWidth + 'px'
    }
  }

  const setVertical = (open: boolean) => {
    if (open) {
      node.style.height = scrollHeight + 'px'
      node.style.display = 'block'
    } else {
      node.style.height = baseHeight + 'px'
      node.style.display = '-webkit-box'
    }
  }

  // controller for setting vertical/horizontal dimensions
  // evaluates the params and calls the appropriate function with the open/closed boolean
  const setDimensions = (params: CollapseParams) => {
    if (params.horizontal) {
      setHorizontal(params.open)
    } else {
      setVertical(params.open)
    }
  }

  // if orientation is vertical, set most of the line clamp properties
  // the element will successfully implement ellipsis + line clamp when display is set to -webkit-box
  if (!params.horizontal) {
    node.style.webkitLineClamp = lineClamp.toString()
    node.style.webkitBoxOrient = 'vertical'
  }

  // set the initial inline styles to the correct open/closed size depending on the orientation
  // this ensures that the properties are set and transitions can occur
  setDimensions(params)

  // add transition CSS to the component after the correct starting dimensions are set
  const duration = params.duration ?? 500

  // if the starting dimension is wrong, then wait until it's finished changing to set a transition
  setTimeout(() => (node.style.transition = `all ${duration}ms`))

  return {
    update: (params: CollapseParams) => {
      setDimensions(params)
    },
  }
}
