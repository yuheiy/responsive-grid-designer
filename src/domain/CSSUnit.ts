export const rem = (px: number): string => {
  return `${px / 16}rem`
}

export const precentage = (value: number): string => {
  const result = value * 100
  const fixedResult = Math.round(result * 10) / 10
  return `${fixedResult}%`
}
