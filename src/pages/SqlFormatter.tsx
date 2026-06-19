import { useState } from 'react'
import { format } from 'sql-formatter'
import { Copy, Play } from 'lucide-react'

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      setError('')
      const result = format(input, { language: 'sql', keywordCase: 'upper' })
      setOutput(result)
    } catch (e: any) {
      setError(e.message || 'Invalid SQL')
      setOutput('')
    }
  }

  const copy = () => navigator.clipboard.writeText(output)

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">SQL Formatter + Beautifier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Input SQL</label>
          <textarea
            className="w-full h-64 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="SELECT * FROM users WHERE id = 1"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button onClick={handleFormat} className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm flex items-center gap-2 cursor-pointer">
            <Play size={16} /> Format
          </button>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Formatted Output</label>
          <div className="relative">
            <textarea
              className="w-full h-64 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 font-mono"
              readOnly
              value={output}
            />
            {output && (
              <button onClick={copy} className="absolute top-2 right-2 bg-white border border-gray-300 p-1.5 rounded hover:bg-gray-50 cursor-pointer" title="Copy">
                <Copy size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
