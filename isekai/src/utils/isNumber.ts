export const isNumber = (n: number | null | undefined) =>
  n !== undefined && n !== null && !isNaN(n)
