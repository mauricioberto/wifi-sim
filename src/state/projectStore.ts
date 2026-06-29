import { createStore } from 'zustand/vanilla'
import type { Structure, AccessPoint, Project, Frequency, BackgroundImageTransform } from '../domain/types'

interface ProjectState {
  project: Project
  selectedIds: string[]
  undoStack: Project[]
  redoStack: Project[]
  updateFrequency: (freq: Frequency) => void
  addStructure: (s: Structure) => void
  removeStructure: (id: string) => void
  updateStructure: (s: Structure) => void
  addAccessPoint: (ap: AccessPoint) => void
  removeAccessPoint: (id: string) => void
  updateAccessPoint: (ap: AccessPoint) => void
  setBackground: (img: string | undefined) => void
  setBackgroundTransform: (t: BackgroundImageTransform) => void
  selectIds: (ids: string[]) => void
  clearSelection: () => void
  undo: () => void
  redo: () => void
  pushUndo: () => void
  loadProject: (p: Project) => void
  resetProject: () => void
}

function createEmptyProject(name = 'Novo Projeto'): Project {
  const now = new Date().toISOString()
  return {
    version: '1.0',
    name,
    frequency: '2.4',
    structures: [],
    accessPoints: [],
    grid: { enabled: true, size: 20 },
    metadata: { createdAt: now, updatedAt: now },
  }
}

export const useProjectStore = createStore<ProjectState>((set, get) => ({
  project: createEmptyProject(),
  selectedIds: [],
  undoStack: [],
  redoStack: [],

  pushUndo: () => set((s) => ({
    undoStack: [...s.undoStack.slice(-19), s.project],
    redoStack: [],
  })),

  updateFrequency: (frequency) => {
    get().pushUndo()
    set((s) => ({
      project: { ...s.project, frequency, metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() } },
    }))
  },

  addStructure: (structure) => {
    get().pushUndo()
    set((s) => ({
      project: {
        ...s.project,
        structures: [...s.project.structures, structure],
        metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() },
      },
    }))
  },

  removeStructure: (id) => {
    get().pushUndo()
    set((s) => ({
      project: {
        ...s.project,
        structures: s.project.structures.filter((st) => st.id !== id),
        metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() },
      },
    }))
  },

  updateStructure: (structure) => {
    get().pushUndo()
    set((s) => ({
      project: {
        ...s.project,
        structures: s.project.structures.map((st) => (st.id === structure.id ? structure : st)),
        metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() },
      },
    }))
  },

  addAccessPoint: (ap) => {
    get().pushUndo()
    set((s) => ({
      project: {
        ...s.project,
        accessPoints: [...s.project.accessPoints, ap],
        metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() },
      },
    }))
  },

  removeAccessPoint: (id) => {
    get().pushUndo()
    set((s) => ({
      project: {
        ...s.project,
        accessPoints: s.project.accessPoints.filter((ap) => ap.id !== id),
        metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() },
      },
    }))
  },

  updateAccessPoint: (ap) => {
    get().pushUndo()
    set((s) => ({
      project: {
        ...s.project,
        accessPoints: s.project.accessPoints.map((a) => (a.id === ap.id ? ap : a)),
        metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() },
      },
    }))
  },

  setBackground: (backgroundImage) => {
    get().pushUndo()
    set((s) => ({
      project: { ...s.project, backgroundImage, backgroundTransform: undefined, metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() } },
    }))
  },

  setBackgroundTransform: (transform) => {
    set((s) => ({
      project: { ...s.project, backgroundTransform: transform, metadata: { ...s.project.metadata, updatedAt: new Date().toISOString() } },
    }))
  },

  selectIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  undo: () => set((s) => {
    if (s.undoStack.length === 0) return s
    const prev = s.undoStack[s.undoStack.length - 1]
    return {
      project: prev,
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, s.project],
    }
  }),

  redo: () => set((s) => {
    if (s.redoStack.length === 0) return s
    const next = s.redoStack[s.redoStack.length - 1]
    return {
      project: next,
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, s.project],
    }
  }),

  loadProject: (project) => set({ project, selectedIds: [], undoStack: [], redoStack: [] }),

  resetProject: () => set({ project: createEmptyProject(), selectedIds: [], undoStack: [], redoStack: [] }),
}))
