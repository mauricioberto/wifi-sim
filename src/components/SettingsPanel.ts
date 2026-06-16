import { useSettingsStore } from '../state/settingsStore'

export function renderSettingsPanel(containerId: string): void {
  const container = document.getElementById(containerId)
  if (!container) return

  container.className = 'w-72 bg-white border-l border-gray-200 p-4 text-sm select-none'
  container.innerHTML = ''

  createSection(container, 'Configurações')

  createLabel(container, 'Frequência')
  const freqDiv = document.createElement('div')
  freqDiv.className = 'flex gap-2 mb-3'
  const freq24 = createRadio('freq', '2.4 GHz', '2.4')
  const freq5 = createRadio('freq', '5 GHz', '5')
  freqDiv.appendChild(freq24)
  freqDiv.appendChild(freq5)
  container.appendChild(freqDiv)

  freq24.querySelector('input')!.addEventListener('change', () => {
    useSettingsStore.getState().setFrequency('2.4')
  })
  freq5.querySelector('input')!.addEventListener('change', () => {
    useSettingsStore.getState().setFrequency('5')
  })

  const state = useSettingsStore.getState()
  if (state.frequency === '2.4') (freq24.querySelector('input') as HTMLInputElement).checked = true
  else (freq5.querySelector('input') as HTMLInputElement).checked = true

  createToggle(container, 'Heatmap', state.heatmapVisible, () => {
    useSettingsStore.getState().toggleHeatmap()
  })

  createToggle(container, 'Grid', state.grid.enabled, (val) => {
    useSettingsStore.getState().setGrid({ enabled: val })
  })

  createLabel(container, 'Resolução')
  const resSelect = document.createElement('select')
  resSelect.className = 'w-full border border-gray-300 rounded px-2 py-1 mb-3 text-sm'
  resSelect.innerHTML = `
    <option value="100">100×100 (rápido)</option>
    <option value="200" selected>200×200 (padrão)</option>
    <option value="400">400×400 (preciso)</option>
  `
  resSelect.value = String(state.heatmapResolution)
  resSelect.addEventListener('change', () => {
    useSettingsStore.getState().setHeatmapResolution(Number(resSelect.value))
  })
  container.appendChild(resSelect)

  const resEl = resSelect as HTMLSelectElement
  useSettingsStore.subscribe((s) => {
    if (s.frequency === '2.4') (freq24.querySelector('input') as HTMLInputElement).checked = true
    else (freq5.querySelector('input') as HTMLInputElement).checked = true
    resEl.value = String(s.heatmapResolution)
  })
}

function createSection(parent: HTMLElement, text: string): void {
  const h = document.createElement('h3')
  h.className = 'font-bold text-gray-800 mb-3 text-base'
  h.textContent = text
  parent.appendChild(h)
}

function createLabel(parent: HTMLElement, text: string): void {
  const l = document.createElement('label')
  l.className = 'block text-gray-600 mb-1 text-xs font-medium uppercase tracking-wide'
  l.textContent = text
  parent.appendChild(l)
}

function createRadio(name: string, label: string, value: string): HTMLElement {
  const div = document.createElement('label')
  div.className = 'flex items-center gap-1 cursor-pointer'
  div.innerHTML = `
    <input type="radio" name="${name}" value="${value}" class="accent-blue-600">
    <span>${label}</span>
  `
  return div
}

function createToggle(parent: HTMLElement, label: string, initial: boolean, onChange: (val: boolean) => void): void {
  const div = document.createElement('label')
  div.className = 'flex items-center justify-between mb-3 cursor-pointer'
  const span = document.createElement('span')
  span.className = 'text-gray-700'
  span.textContent = label

  const toggle = document.createElement('input')
  toggle.type = 'checkbox'
  toggle.checked = initial
  toggle.className = 'toggle w-9 h-5 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 relative cursor-pointer transition-colors'
  toggle.style.setProperty('--tw-toggle-size', '1.25rem')
  toggle.addEventListener('change', () => onChange(toggle.checked))

  div.appendChild(span)
  div.appendChild(toggle)
  parent.appendChild(div)
}
