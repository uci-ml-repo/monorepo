import type { Options } from 'jspreadsheet-ce'

export const columns: Options['columns'] = [
  { title: 'ID', width: 50, readOnly: true },
  { title: 'Names', width: 100 },
  {
    title: 'Role',
    type: 'dropdown',
    source: ['ID', 'Target', 'Other', 'Feature'],
    width: 100,
  },
  {
    title: 'Variable Type',
    type: 'dropdown',
    width: 150,
    source: ['Continuous', 'Discrete', 'Categorical', 'Date'],
  },
  { title: 'Description', width: 150 },
  { title: 'Units', width: 69 },
  {
    title: 'Missing Values',
    type: 'checkbox',
    width: 120,
    source: ['false', 'true'],
  },
]

export const minDimensions: Options['minDimensions'] = [6, 10]

const default_config: Options = {
  columns,
  minDimensions,
}

export default default_config
