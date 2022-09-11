import type { ChartConfiguration, ChartData } from 'chart.js'

// an array of Evals are required to initialize the chart properly
interface Eval {
  models: {
    args: string | null
    code: string
    name: string
    task: string
  }
  metrics: {
    args: string | null
    code: string
    name: string
    task: string
  }
  ID: number
  datasetID: number
  metricID: number
  modelID: number
  metric: number | null
  lowerBound: number | null
  upperBound: number | null
}

const chartColors = {
  main: '#0D66A2',
}

// given a metric data array, e.g. either returned from the function below
// generate options for displaying the chart
//////////////////////////////////////////
export function getOptions(metricData: ChartData['datasets']) {
  const options: ChartConfiguration['options'] = {
    // the animation gives me a headache
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        grid: {
          // looks cleaner without tick marks
          drawTicks: false,
        },
        ticks: {
          // give the x numbers some spacing
          padding: 20,
        },
      },
      y: {
        // extend the y-axis by 1 so there's some padding against the top of the chart
        max: metricData.length + 1,

        grid: {
          // don't need tick marks
          drawTicks: false,

          // don't need cross-hatch/grid
          drawOnChartArea: false,
        },
        ticks: {
          // color of the labels are blue
          color: chartColors.main,

          // instead of a normal y-axis, e.g. labeled with numbers,
          // label it only with labels from accuracy or precision (function below), e.g.
          // y = "Xgboost Classification" instead of y = 5, idk where this comes from, but I'm not an ML person
          callback: function (value) {
            const index = (value as number) - 1
            return metricData[index] != null ? metricData[index].label : ''
          },

          // space between the labels
          padding: 20,
        },
      },
    },
    plugins: {
      // the default Y axis labels are overriden by the ticks callback function
      legend: {
        display: false,
      },

      // when hovering over certain things, a callback will be used to determine what to show
      tooltip: {
        callbacks: {
          // on hover, the title of the tooltip will be a precision 3 decimal number
          title: function (tooltipItems) {
            if (typeof tooltipItems !== 'string') {
              return ((tooltipItems[0].parsed.x * 1000) / 1000).toFixed(3)
            }
            return ''
          },

          // don't display any additional info in the tooltip
          label: () => '',
        },
      },
    },
  }
  return options
}

// generate an array of data points for the chart based on the type of eval
//////////////////////////////////////////
export function setEvalsData(evals: Eval[]) {
  const accuracy: ChartData['datasets'] = []
  const precision: ChartData['datasets'] = []

  // for each eval, push 2 points onto the chart
  evals.forEach((e) => {
    // labels will be an array of capitalized names
    const labels = e.models.name
      .split(' ')
      .map((label) => label.charAt(0).toUpperCase() + label.slice(1)) as never

    // if any properties are null, skip the eval
    if (!e.metric || !e.lowerBound || !e.upperBound) {
      return
    }

    // push datapoints into the array depending on whether they're for precision or accuracy
    switch (e.metrics.name) {
      case 'accuracy':
        accuracy.push(
          ...[
            {
              // this point is just a point
              // label needs a string, but an array works fine, so cast to never above
              label: labels,

              // color of the dot in the center of the line
              backgroundColor: chartColors.main,

              // the first data point is a dot in the center of the line between the data points below
              data: [{ x: e.metric, y: accuracy.length + 1 }],
            },
            {
              // this point is a line between 2 points
              type: 'line' as const,

              // the edges of the lines are small crosses, and the point in the center is a normal dot
              pointStyle: 'cross',

              // the color of the actual line; it would be greyed out otherwise
              borderColor: chartColors.main,

              // default width is too thicc
              borderWidth: 2,

              // a horizonal line is made at the same y-position as the point above,
              // between the lower and upper bounds, e.g. to the left and right of the point above
              data: [
                { x: e.lowerBound, y: accuracy.length + 1 },
                { x: e.upperBound, y: accuracy.length + 1 },
              ],
            },
          ]
        )
        break

      // same logic above as above, could be optimized later
      case 'precision':
        precision.push(
          ...[
            {
              label: labels,
              backgroundColor: chartColors.main,
              data: [{ x: e.metric, y: precision.length + 1 }],
            },
            {
              type: 'line' as const,
              pointStyle: 'cross',
              backgroundColor: chartColors.main,
              borderColor: chartColors.main,
              borderWidth: 2,
              data: [
                { x: e.lowerBound, y: precision.length + 1 },
                { x: e.upperBound, y: precision.length + 1 },
              ],
            },
          ]
        )
        break
    }
  })
  return {
    accuracy,
    precision,
  }
}
