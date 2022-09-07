export const AbbrevNum = (num: number) =>
  new Intl.NumberFormat('en-EN', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(num)
