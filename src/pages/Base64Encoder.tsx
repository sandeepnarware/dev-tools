import { useState } from 'react'
import { Copy, ArrowUpDown } from 'lucide-react'

export default function Base64Encoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const convert = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch {
      setOutput('Invalid input for decoding')
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Base64 Encoder / Decoder</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setMode('encode'); setOutput('') }} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${mode === 'encode' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Encode</button>
        <button onClick={() => { setMode('decode'); setOutput('') }} className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer ${mode === 'decode' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Decode</button>
        <button onClick={() => { setMode(m => m === 'encode' ? 'decode' : 'encode'); setOutput(''); setInput('') }} className="text-gray-400 hover:text-gray-600 cursor-pointer"><ArrowUpDown size={20} /></button>
      </div>
      <textarea className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 to decode...'} />
      <button onClick={convert} className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">{mode === 'encode' ? 'Encode' : 'Decode'}</button>
      {output && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
          <code className="flex-1 text-sm font-mono break-all">{output}</code>
          <button onClick={() => navigator.clipboard.writeText(output)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>
        </div>
      )}
    </div>
  )
}
