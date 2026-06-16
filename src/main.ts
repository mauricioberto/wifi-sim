import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="flex h-full w-full">
    <div id="toolbar" class="w-14 bg-gray-900 flex flex-col items-center py-2 gap-1"></div>
    <div id="canvas-container" class="flex-1 relative bg-gray-100"></div>
    <div id="settings-panel" class="w-72 bg-white border-l border-gray-200 hidden"></div>
  </div>
  <div id="legend" class="absolute bottom-0 left-14 right-0 h-10 bg-white border-t border-gray-200"></div>
`
