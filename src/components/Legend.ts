export function renderLegend(containerId: string): void {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ''
  container.className = 'absolute bottom-0 left-14 right-0 h-10 bg-white border-t border-gray-200 flex items-center px-4 text-xs text-gray-600 gap-1 select-none'

  const items = [
    { color: '#0064FF', label: '≥ -45' },
    { color: '#32CD32', label: '-55' },
    { color: '#FFD700', label: '-65' },
    { color: '#FFA500', label: '-75' },
    { color: '#DC3232', label: '-85' },
    { color: '#808080', label: 'sem sinal' },
  ]

  const label = document.createElement('span')
  label.textContent = 'dBm:'
  label.className = 'font-medium mr-1'
  container.appendChild(label)

  for (const item of items) {
    const swatch = document.createElement('span')
    swatch.className = 'inline-block w-4 h-3 rounded-sm'
    swatch.style.backgroundColor = item.color
    container.appendChild(swatch)

    const text = document.createElement('span')
    text.textContent = item.label
    container.appendChild(text)
  }
}
