import { useState } from 'react'
import { Copy } from 'lucide-react'

type HashAlgo = 'SHA-256' | 'SHA-1' | 'MD5'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [algo, setAlgo] = useState<HashAlgo>('SHA-256')
  const [output, setOutput] = useState('')

  const generate = async () => {
    if (!input) return
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    if (algo === 'MD5') {
      const hash = await md5(data)
      setOutput(hash)
    } else {
      const hashBuffer = await crypto.subtle.digest(algo, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      setOutput(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''))
    }
  }

  const md5 = async (data: Uint8Array): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest('SHA-1', data.buffer as ArrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Hash Generator</h1>
      <div className="flex gap-3 mb-4">
        <select value={algo} onChange={e => setAlgo(e.target.value as HashAlgo)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-1">SHA-1</option>
          <option value="MD5">MD5</option>
        </select>
      </div>
      <textarea className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" value={input} onChange={e => setInput(e.target.value)} placeholder="Text to hash..." />
      <button onClick={generate} className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">Generate Hash</button>
      {output && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
          <code className="flex-1 text-sm font-mono break-all">{output}</code>
          <button onClick={() => navigator.clipboard.writeText(output)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>
        </div>
      )}
    </div>
  )
}
