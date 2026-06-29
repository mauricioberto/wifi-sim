import { COLOR_STOPS } from '../simulation/colorScale'

export function renderLegend(containerId: string): void {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ''
  container.className = 'absolute bottom-0 left-14 right-0 h-10 bg-white border-t border-gray-200 flex items-center px-4 text-xs text-gray-600 gap-1 select-none'

  const label = document.createElement('span')
  label.textContent = 'dBm:'
  label.className = 'font-medium mr-1'
  container.appendChild(label)

  for (const stop of COLOR_STOPS) {
    const swatch = document.createElement('span')
    swatch.className = 'inline-block w-4 h-3 rounded-sm'
    swatch.style.backgroundColor = stop.color
    container.appendChild(swatch)

    const text = document.createElement('span')
    text.textContent = stop.label
    container.appendChild(text)
  }
}
