<script lang="ts">
  import { onMount } from 'svelte'
  import type { CellValue, Options, JSpreadsheetElement } from 'jspreadsheet-ce'

  // a spreadsheet can accept a 2D array of values and mutate it during spreadsheet operations
  // the parent component should bind to this value to receive updated spreadsheet data

  export let value: CellValue[][] = [
    ['Mazda', 2001, 2000],
    ['Pegeout', 2010, 5000],
    ['Honda Fit', 2009, 3000],
    ['Honda CRV', 2010, 6000],
  ]

  // define default configuration of a spreadsheet (can be overriden with the "options" prop)
  //////////////////////////////////////////

  export let options: Options = {}

  let columns: Options['columns'] = [
    { title: 'Names', width: 120 },
    {
      title: 'Role',
      type: 'dropdown',
      source: ['ID', 'Target', 'Other', 'Feature'],
      width: 120,
    },
    {
      title: 'Variable Type',
      type: 'dropdown',
      width: 240,
      source: ['Numerical - Continuous', 'Numerical - Discrete', 'Categorical', 'Date'],
    },
    { title: 'Units', width: 70 },
    { title: 'Description', width: 140 },
    {
      title: 'Missing Values',
      type: 'dropdown',
      width: 140,
      source: ['No', 'Yes'],
    },
  ]

  const minDimensions: Options['minDimensions'] = [6, 10]

  // spreadsheet initialization
  //////////////////////////////////////////

  // bind the JSpreadsheet DOM node to this variable
  // it will have jspreadsheet/jexcel properties that house the spreadsheet functions
  let node: { jspreadsheet: JSpreadsheetElement; jexcel: JSpreadsheetElement }

  const initializeSpreadsheet = async () => {
    const div = document.getElementById('spreadsheet') as HTMLDivElement

    const { default: jspreadsheet } = await import('jspreadsheet-ce')

    jspreadsheet(div, {
      data: value,
      columns,
      minDimensions,
      onchange: () => {
        // whenver the spreadsheet changes, update the value with the new data
        value = node.jspreadsheet.getData()
      },

      // prioritize options from props
      ...options,
    })
  }

  // jspreadsheet doesn't work on the server, so only initialize in the browser/onMount
  onMount(initializeSpreadsheet)
</script>

<!-- use a custom HTML tag name to bamboozle TypeScript;
otherwise it will infer that it's an HTMLDivElement -->
<spreadsheet id="spreadsheet" bind:this={node} />
