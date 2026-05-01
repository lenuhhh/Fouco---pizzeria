export function formatEUR(value) {
  const amount = Number(value || 0) / 100
  return '\u20B4\u202F' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
