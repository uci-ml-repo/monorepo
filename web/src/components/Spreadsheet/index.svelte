<script lang="ts">
  import './jexcel.css'
  import './jsuites.css'
  import { columns, minDimensions } from './default_config'

  import { onMount } from 'svelte'
  import type { CellValue, Options, JSpreadsheetElement } from 'jspreadsheet-ce'

  // a spreadsheet can accept a 2D array of values and mutate it during spreadsheet operations
  // the parent component should bind to this value to receive updated spreadsheet data
  export let value: CellValue[][] = []

  // bind the JSpreadsheet DOM node to this variable
  // it will have jspreadsheet/jexcel properties that house the spreadsheet functions
  interface HTMLJspreadsheetElement extends HTMLDivElement {
    jspreadsheet: JSpreadsheetElement
    jexcel: JSpreadsheetElement
  }

  let node: HTMLJspreadsheetElement

  // default configuration of a spreadsheet (can be overridden with the "options" prop)
  //////////////////////////////////////////

  export let options: Options = {}

  // spreadsheet initialization
  //////////////////////////////////////////

  const initializeSpreadsheet = async () => {
    const div = document.getElementById('spreadsheet') as HTMLDivElement

    // don't import this at the top level because it has side effects that should only run in the browser
    const { default: jspreadsheet } = await import('jspreadsheet-ce')

    jspreadsheet(div, {
      data: value,
      onchange: (
        _instance: HTMLElement,
        _cell: HTMLTableCellElement,
        _columnIndex: string,
        rowIndex: string
      ) => {
        // whenver the spreadsheet changes, update the value with the new data of the row
        value[parseInt(rowIndex)] = node.jspreadsheet.getRowData(parseInt(rowIndex))
      },

      // load default configuration first
      columns,

      // if there are values, don't set min dimensions
      ...(value.length ? {} : minDimensions),

      // and then prioritize options from props
      ...options,
    })
  }

  // jspreadsheet doesn't work on the server, so only initialize in the browser/onMount
  onMount(initializeSpreadsheet)
</script>

<!-- use a custom HTML tag name to bamboozle TypeScript;
otherwise it will infer that it's an HTMLDivElement that isn't a HTMLJspreadsheetElement -->
<spreadsheet id="spreadsheet" bind:this={node} />
