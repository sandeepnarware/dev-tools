import { create } from 'zustand'

export interface Note {
  id: string
  text: string
  tags: string[]
  createdAt: number
}

interface NotesState {
  notes: Note[]
  addNote: (text: string) => void
  deleteNote: (id: string) => void
  getNotesByTag: (tag: string) => Note[]
  getAllTags: () => string[]
}

const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem('devtools-notes')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: loadNotes(),
  addNote: (text: string) => {
    const tags = Array.from(text.matchAll(/#(\w+)/g)).map(m => m[1])
    const note: Note = {
      id: crypto.randomUUID(),
      text,
      tags,
      createdAt: Date.now(),
    }
    set((s) => {
      const updated = [note, ...s.notes]
      localStorage.setItem('devtools-notes', JSON.stringify(updated))
      return { notes: updated }
    })
  },
  deleteNote: (id: string) => {
    set((s) => {
      const updated = s.notes.filter(n => n.id !== id)
      localStorage.setItem('devtools-notes', JSON.stringify(updated))
      return { notes: updated }
    })
  },
  getNotesByTag: (tag: string) => {
    return get().notes.filter(n => n.tags.includes(tag))
  },
  getAllTags: () => {
    const tags = new Set<string>()
    get().notes.forEach(n => n.tags.forEach(t => tags.add(t)))
    return Array.from(tags)
  },
}))
