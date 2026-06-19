import { useState } from 'react'
import { JSONPath } from 'jsonpath-plus'
import { Copy } from 'lucide-react'

type Tab = 'format' | 'minify' | 'validate' | 'path' | 'compare' | 'search'

export default function JsonTools() {
  const [tab, setTab] = useState<Tab>('format')
  const [input, setInput] = useState('')
  const [input2, setInput2] = useState('')
  const [output, setOutput] = useState('')
  const [pathExpr, setPathExpr] = useState('$.')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFormat = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)) } catch { setOutput('Invalid JSON') }
  }

  const handleMinify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))) } catch { setOutput('Invalid JSON') }
  }

  const handleValidate = () => {
    try { JSON.parse(input); setOutput('✓ Valid JSON') } catch (e: any) { setOutput('✗ ' + e.message) }
  }

  const handlePath = () => {
    try {
      const parsed = JSON.parse(input)
      const result = JSONPath({ path: pathExpr, json: parsed })
      setOutput(JSON.stringify(result, null, 2))
    } catch (e: any) { setOutput('Error: ' + e.message) }
  }

  const handleSearch = () => {
    try {
      const parsed = JSON.parse(input)
      const jsonStr = JSON.stringify(parsed, null, 2)
      if (!searchTerm) { setOutput(jsonStr); return }
      const lines = jsonStr.split('\n')
      const matching = lines.filter(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
      setOutput(matching.join('\n') || 'No matches')
    } catch { setOutput('Invalid JSON') }
  }

  const handleCompare = () => {
    try {
      const a = JSON.stringify(JSON.parse(input), null, 2)
      const b = JSON.stringify(JSON.parse(input2), null, 2)
      if (a === b) setOutput('✓ JSONs are identical')
      else setOutput('✗ JSONs differ')
    } catch { setOutput('Invalid JSON in one or both inputs') }
  }

  const runAction = () => {
    if (tab === 'format') handleFormat()
    else if (tab === 'minify') handleMinify()
    else if (tab === 'validate') handleValidate()
    else if (tab === 'path') handlePath()
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">JSON Tools</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['format', 'minify', 'validate', 'path'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${tab === t ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button onClick={() => setTab('compare')} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${tab === 'compare' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Compare</button>
        <button onClick={() => setTab('search')} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${tab === 'search' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Search</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {tab === 'compare' ? 'JSON A' : 'Input JSON'}
          </label>
          <textarea className="w-full h-56 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" value={input} onChange={e => setInput(e.target.value)} placeholder='{"key": "value"}' />
          {tab === 'compare' && <>
            <label className="text-sm font-medium text-gray-700 mb-1 block mt-2">JSON B</label>
            <textarea className="w-full h-56 border border-gray-300 rounded-lg p-3 text-sm font-mono" value={input2} onChange={e => setInput2(e.target.value)} placeholder='{"key": "value"}' />
          </>}
          {tab === 'path' && <input className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" value={pathExpr} onChange={e => setPathExpr(e.target.value)} placeholder="$.store.book[0].title" />}
          {tab === 'search' && <input className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search term..." />}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Output</label>
            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>}
          </div>
          <pre className="w-full h-56 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 overflow-auto font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {tab !== 'compare' && tab !== 'search' && <button onClick={runAction} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">
          {tab === 'format' ? 'Format' : tab === 'minify' ? 'Minify' : tab === 'validate' ? 'Validate' : 'Query'}
        </button>}
        {tab === 'compare' && <button onClick={handleCompare} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">Compare</button>}
        {tab === 'search' && <button onClick={handleSearch} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">Search</button>}
      </div>
    </div>
  )
}
