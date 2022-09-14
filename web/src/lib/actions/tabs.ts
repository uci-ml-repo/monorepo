interface TabParams {
  active: number
}

export default function tabs(node: HTMLElement, params: TabParams) {
  // create an underline for the tab component
  const underline = document.createElement('div')

  // style the underline with tailwind
  underline.className = 'absolute bottom-0 h-1 rounded bg-secondary'
  underline.style.transition = 'left 500ms, width 500ms'

  // make the parent tab component relative,
  // so the underline can be positioned at the bottom
  node.style.position = 'relative'

  // add the new underline element as a child of the tab parent
  node.appendChild(underline)

  // calculate and set the active tab's start position and width
  const calculatePosition = (params: TabParams) => {
    // get all the tab children
    const tabs = Array.from(node.children) as HTMLElement[]

    // get all the offsets (left starting position) and widths
    const tab_offsets = tabs.map((child) => child.offsetLeft)
    const tab_widths = tabs.map((child) => child.offsetWidth)

    // get the offset and width for the active tab
    const active_offset = params.active === 0 ? 0 : tab_offsets[params.active]
    const active_width = tab_widths[params.active]

    // set the new starting position and width for the active tab
    underline.style.left = active_offset + 'px'
    underline.style.width = active_width + 'px'
  }

  calculatePosition(params)

  return {
    update: async (params: TabParams) => {
      calculatePosition(params)
    },
  }
}
