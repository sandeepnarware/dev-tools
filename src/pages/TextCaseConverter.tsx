import { useState } from 'react'
import { Copy } from 'lucide-react'

export default function TextCaseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convert = (type: string) => {
    const t = input
    switch (type) {
      case 'upper': setOutput(t.toUpperCase()); break
      case 'lower': setOutput(t.toLowerCase()); break
      case 'title': setOutput(t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())); break
      case 'camel': setOutput(t.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase())); break
      case 'pascal': setOutput(t.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase())); break
      case 'snake': setOutput(t.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()); break
      case 'kebab': setOutput(t.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()); break
      case 'constant': setOutput(t.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()); break
      case 'dot': setOutput(t.replace(/[^a-zA-Z0-9]+/g, '.').toLowerCase()); break
    }
  }

  const cases = [
    { key: 'upper', label: 'UPPER CASE' },
    { key: 'lower', label: 'lower case' },
    { key: 'title', label: 'Title Case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'pascal', label: 'PascalCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'constant', label: 'CONSTANT_CASE' },
    { key: 'dot', label: 'dot.case' },
  ]

  const charCount = input.length
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Text Case Converter</h1>
      <textarea className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste text here..." />
      <div className="flex gap-4 text-xs text-gray-500 mb-4">
        <span>Characters: {charCount}</span>
        <span>Words: {wordCount}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cases.map(({ key, label }) => (
          <button key={key} onClick={() => convert(key)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            {label}
          </button>
        ))}
      </div>
      {output && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
          <code className="flex-1 text-sm font-mono break-all">{output}</code>
          <button onClick={() => navigator.clipboard.writeText(output)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>
        </div>
      )}
    </div>
  )
}
