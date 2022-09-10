import type { ActionReturn } from 'svelte/action'

interface CollapseParams {
  open: boolean
  duration?: number
  lineClamp?: number
  baseHeight?: number
  horizontal?: boolean
}

/*
 * prior to using, if the component starts off closed, manually set the
 * style (height or width) to the closed size; after collapse mounts, then it will control the inline style e.g.
 * ```svelte
 * <script>
 *  import { collapse } from '$lib/actions'
 *  let isOpen = false;
 * </script>

 * <div use:collapse={{open: isOpen}} style='width: 0'>
 *  <!-- content here -->
 * </div>
```
*/

export default function collapse(node: HTMLElement, params: CollapseParams): ActionReturn {
  // overflow should be hidden for transitions to work
  node.style.overflow = 'hidden'
  let duration = 0
  /*
   * utility functions to improve readability
   * depending on orientation and open state, set the width or height to
   * one of the pre-computed values above, as well as the display if necessary (e.g. for line clamp)
   */
  const setHorizontal = (open: boolean) => {
    // width will transition between 0 and the original width
    const baseWidth = 0
    const scrollWidth =
      node?.children?.[0]?.tagName === 'SPAN' ? node.children[0].scrollWidth : node.scrollWidth
    if (open) {
      node.style.width = scrollWidth + 'px'
    } else {
      node.style.width = baseWidth + 'px'
    }
  }

  let activeTimeout: null | ReturnType<typeof setTimeout>

  // height to transition to when collapse closes
  // e.g. line height = 24px and line clamp = 2 means that it will be 48px when closed
  const lineHeight = parseInt(window.getComputedStyle(node).getPropertyValue('line-height'))
  const lineClamp = params.lineClamp ?? 2
  let baseHeight =
    params.baseHeight !== undefined
      ? params.baseHeight
      : Math.min(lineClamp * lineHeight, node.scrollHeight)

  const calculateHeight = () => {
    const oldHeight = node.style.height
    node.style.height = 'auto'
    node.getBoundingClientRect()
    if (node.clientHeight <= lineClamp * lineHeight) {
      baseHeight = node.clientHeight
      node.style.height = node.clientHeight + 'px'
    } else {
      node.style.height = oldHeight
    }
  }

  const setVertical = (open: boolean) => {
    // if orientation is vertical, set most of the line clamp properties
    // the element will successfully implement ellipsis + line clamp when display is set to -webkit-box
    node.style.webkitLineClamp = lineClamp.toString()
    node.style.webkitBoxOrient = 'vertical'

    // height when collapse is open
    // base height and scroll height are used to set the height properties exactly,
    // which is interpolated by setting a transition
    const scrollHeight = node.scrollHeight

    if (open) {
      node.style.height = baseHeight + 'px'
      activeTimeout = setTimeout(() => {
        node.style.height = scrollHeight + 'px'
        activeTimeout = setTimeout(() => (node.style.height = 'auto'), duration)
      })
      node.style.display = 'block'
    } else {
      if (duration !== 0) {
        node.style.height = scrollHeight + 'px'
      }
      node.style.display = '-webkit-box'
      setTimeout(() => (node.style.height = baseHeight + 'px'))
    }
  }

  window.addEventListener('resize', calculateHeight)

  // controller for setting vertical/horizontal dimensions
  // evaluates the params and calls the appropriate function with the open/closed boolean
  const setDimensions = (params: CollapseParams) => {
    if (params.horizontal) {
      setHorizontal(params.open)
    } else {
      setVertical(params.open)
    }
  }

  // crude function to calculate the duration of a transition
  const getAutoDuration = (params: CollapseParams) => {
    return Math.log(params.horizontal ? node.scrollWidth : node.scrollHeight) + 200
  }

  // set the initial inline styles to the correct open/closed size depending on the orientation
  // this ensures that the properties are set and transitions can occur
  setDimensions(params)

  // add transition CSS to the component after the correct starting dimensions are set
  // if the starting dimension is wrong, then wait until it's finished changing to set a transition
  // apply the transition style to both the children and the parent
  duration = params.duration ?? getAutoDuration(params)
  node.style.transition = `all ${duration}ms`

  return {
    /* whenever a parameter changes, e.g. open, this function is run with all the new parameters
     * and sets the dimensions, parameters are defined when initializing use:collapse, e.g.
     * ```svelte
     * <script>
     *  import { collapse } from '$lib/actions'
     *  let isOpen = false;
     *  let isHorizontal = true;
     * </script>
     *
     * <div use:collapse={{ open: isOpen, horizontal: isHorizontal }}>
     *  <!-- content here -->
     *  </div>
     * ```
     * will update if isOpen changes or isHorizontal changes
     */
    update: async (params: CollapseParams) => {
      if (activeTimeout) {
        clearTimeout(activeTimeout)
      }
      setDimensions(params)
    },
  }
}
