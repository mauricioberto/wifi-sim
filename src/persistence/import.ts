import type { Project } from '../domain/types'

export function importProject(): Promise<Project> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.wifisim,application/json'

    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) {
        reject(new Error('Nenhum arquivo selecionado'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as Project
          if (!data.version || !data.name) {
            reject(new Error('Arquivo inválido: formato .wifisim não reconhecido'))
            return
          }
          resolve(data)
        } catch {
          reject(new Error('Erro ao parsear arquivo'))
        }
      }
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    })

    input.click()
  })
}
