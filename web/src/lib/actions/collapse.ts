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

  // overflow should be hidden for transitions to work
  node.style.overflow = 'hidden'

  /*
   * utility functions to improve readability
   * depending on orientation and open state, set the width or height to
   * one of the pre-computed values above, as well as the display if necessary (e.g. for line clamp)
   */
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

  // crude function to calculate the duration of a transition
  const getAutoDuration = (params: CollapseParams) => {
    return Math.log(params.horizontal ? node.scrollWidth : node.scrollHeight) + 200
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
  // if the starting dimension is wrong, then wait until it's finished changing to set a transition
  const duration = params.duration ?? getAutoDuration(params)
  setTimeout(() => (node.style.transition = `all ${duration}ms`))

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
    update: (params: CollapseParams) => {
      setDimensions(params)
    },
  }
}
