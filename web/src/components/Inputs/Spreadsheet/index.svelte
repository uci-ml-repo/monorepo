<script lang="ts">
  import './jexcel.css'
  import './jsuites.css'
  import { columns, minDimensions } from './default_config'

  import ExcelIcon from '$components/Icons/Excel.svelte'

  import { onMount } from 'svelte'
  import type { CellValue, Options, JSpreadsheetElement } from 'jspreadsheet-ce'

  import FileInput from '$components/Fields/File.svelte'
  import { parse } from 'papaparse'

  // props provided by the parent form component
  export let hasHeaderRow = false
  export let missingIndicator: unknown = null

  //////////////////////////////////////////
  // CSV papaparse setup
  //////////////////////////////////////////
  const dateformat1 = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/
  const dateformat2 = /^(0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])[/-]\d{4}$/
  const floatRegex = /^-?\d*(?:[.,]\d*?)?$/
  const intRegex = /^-?\d+$/

  function handleChange(event: Event) {
    let newFiles = Array.from((event.target as HTMLInputElement).files || [])

    // there's only one file, so just get the first one
    const newFile = newFiles[0]

    parse(newFile, {
      header: false,
      skipEmptyLines: true,
      preview: 5000,
      fastMode: true,
      complete: function (results) {
        const data = results.data as string[][]

        // each row is an attribute, either with a name or just "Attribute#"
        const attributes = data[0].map((header, i) => {
          if (hasHeaderRow && header !== null && header !== '') {
            return header
          } else {
            return 'Attribute' + (i + 1).toString()
          }
        })

        // remove all rows except one (since it won't let you do that)
        const currentRows = node.jspreadsheet.getData().length || 0
        for (let i = 0; i < currentRows - 1; i++) {
          node.jspreadsheet.deleteRow(0, null)
        }

        // add rows until it matches the number of attributes
        for (let i = 0; i < attributes.length - 1; i++) {
          node.jspreadsheet.insertRow(0)
        }

        // if there's a header row, exclude it from the parsing
        const dataToParse = hasHeaderRow ? data.slice(1) : data
        const numRows = hasHeaderRow ? data.length - 1 : data.length

        for (let col = 0; col < attributes.length; col += 1) {
          let missing = 'No'
          let variableType = null

          for (let row = 0; row < Math.min(numRows, 1000); row += 1) {
            const d = dataToParse[row][col].trim()
            if (d === missingIndicator) {
              missing = 'Yes'
            } else if (d.match(dateformat1) || d.match(dateformat2)) {
              variableType = 'Date'
            } else if (d.match(intRegex)) {
              variableType = 'Numerical - Discrete'
            } else if (d.match(floatRegex)) {
              variableType = 'Numerical - Continuous'
            } else {
              variableType = 'Categorical'
            }
          }

          const newRow = [-1, attributes[col], 'Feature', variableType || '', '', '', missing]
          node.jspreadsheet.setRowData(col, newRow)
        }
      },
    })
  }

  //////////////////////////////////////////
  // jspreadsheet spreadsheet editor setup
  //////////////////////////////////////////

  // a spreadsheet can accept a 2D array of values and mutate it during spreadsheet operations
  // the parent component should bind to this value to receive updated spreadsheet data
  export let value: CellValue[][] = []

  // parent form data should bind to the custom file form data object,
  // since it can be transmitted over tRPC
  export let file: FileObject | null = null

  // bind the JSpreadsheet DOM node to this variable
  // it will have jspreadsheet/jexcel properties that house the spreadsheet functions
  interface HTMLJspreadsheetElement extends HTMLDivElement {
    jspreadsheet: JSpreadsheetElement
    jexcel: JSpreadsheetElement
  }

  // a parent form field can bind to the jspreadsheet node to perform operations on the spreadsheet
  // used in the tabular form to coordinate data between the CSV file input and the spreadsheet
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

      // after the spreadsheet has been changed, update the value
      onafterchanges: () => {
        value = node.jspreadsheet.getData()
      },

      // load default configuration first
      columns,

      // if there are values, don't set min dimensions
      ...(value?.length ? {} : { minDimensions }),

      // and then prioritize options from props
      ...options,
    })
  }

  // jspreadsheet doesn't work on the server, so only initialize in the browser/onMount
  onMount(initializeSpreadsheet)

  $: if (node?.jspreadsheet && !file?.data) {
    // after jspreadsheet has been initialized, whenever file form data becomes empty (reset),
    // reset spreadsheet data to the min dimensions and reset the spreadsheet value
    value = []
    node.jspreadsheet.setData(
      Array(minDimensions?.[1]).fill(Array(minDimensions?.[0]).fill([]))
    )
  }
</script>

<div class="w-full flex flex-col gap-8">
  <!-- CSV file input for the spreadsheet data -->
  <div class="flex flex-col gap-4 relative h-64">
    <!-- the spreadsheet will delegate file handling to the file input -->
    <FileInput bind:value={file} on:change={handleChange}>
      <!-- slot in an excel icon and the file name whenver a file is uploaded -->
      <div class="flex gap-3 items-center justify-center h-full">
        <span>{file?.name}</span>
        <ExcelIcon class="h-12 text-primary fill-primary" />
      </div>
    </FileInput>
  </div>

  <!-- use a custom HTML tag name to bamboozle TypeScript;
  otherwise it will infer that it's an HTMLDivElement that isn't a HTMLJspreadsheetElement -->
  <div class="overflow-auto mx-auto max-w-full">
    <spreadsheet id="spreadsheet" bind:this={node} />
  </div>
</div>
