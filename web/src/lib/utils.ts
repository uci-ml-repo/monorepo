// create a number formatter from the Intl library, invocation:
// AbbrevNum.format(123456789)
export const AbbrevNum = new Intl.NumberFormat('en-EN', {
  notation: 'compact',
  maximumFractionDigits: 2,
})
