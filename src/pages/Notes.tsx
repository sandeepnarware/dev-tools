import { useState } from 'react'
import { useNotesStore } from '../store/notes-store'
import { Plus, Trash2, Tag } from 'lucide-react'

export default function Notes() {
  const [input, setInput] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const { notes, addNote, deleteNote, getAllTags } = useNotesStore()
  const tags = getAllTags()

  const filtered = filterTag ? notes.filter(n => n.tags.includes(filterTag)) : notes

  const handleAdd = () => {
    if (input.trim()) {
      addNote(input.trim())
      setInput('')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Quick Notes</h1>
      <div className="flex gap-2 mb-4 items-start">
        <textarea
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y min-h-[38px]"
          placeholder="Write a note... use #tag for tagging"
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.ctrlKey || e.metaKey) && handleAdd()}
        />
        <button onClick={handleAdd} className="bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 cursor-pointer mt-1">
          <Plus size={18} />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilterTag(null)} className={`text-xs px-2 py-1 rounded-full ${!filterTag ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} cursor-pointer`}>All</button>
          {tags.map(t => (
            <button key={t} onClick={() => setFilterTag(t)} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${filterTag === t ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} cursor-pointer`}>
              <Tag size={12} />#{t}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {filtered.map(note => (
          <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2">
            <p className="flex-1 text-sm text-gray-700 whitespace-pre-wrap">{note.text}</p>
            <button onClick={() => deleteNote(note.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No notes yet</p>}
      </div>
    </div>
  )
}
