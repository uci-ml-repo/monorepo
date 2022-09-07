import type { Options } from 'jspreadsheet-ce'

const columns: Options['columns'] = [
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

const default_config: Options = {
  columns,
  minDimensions,
}

export default default_config
