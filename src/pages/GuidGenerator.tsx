import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'

export default function GuidGenerator() {
  const [count, setCount] = useState(1)
  const [guids, setGuids] = useState<string[]>(() => [crypto.randomUUID()])
  const [format, setFormat] = useState<'default' | 'upper' | 'nobraces' | 'nohyphens'>('default')

  const generate = () => {
    const arr = Array.from({ length: count }, () => {
      let g = crypto.randomUUID() as string
      if (format === 'upper') g = g.toUpperCase()
      else if (format === 'nobraces') g = g.replace(/[{}]/g, '')
      else if (format === 'nohyphens') g = g.replace(/-/g, '')
      return g
    })
    setGuids(arr)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">GUID Generator</h1>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700">Count:</label>
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <select value={format} onChange={e => setFormat(e.target.value as any)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
          <option value="default">Default</option>
          <option value="upper">Uppercase</option>
          <option value="nohyphens">No Hyphens</option>
        </select>
        <button onClick={generate} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm flex items-center gap-2 cursor-pointer"><RefreshCw size={16} /> Generate</button>
      </div>
      <div className="space-y-2">
        {guids.map((g, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <code className="flex-1 text-sm font-mono">{g}</code>
            <button onClick={() => navigator.clipboard.writeText(g)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
