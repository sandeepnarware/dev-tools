import { useState } from 'react'
import { Play, Copy } from 'lucide-react'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export default function RestApiTester() {
  const [method, setMethod] = useState<Method>('GET')
  const [url, setUrl] = useState('')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState('')
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    setResponse('')
    setStatus(null)
    try {
      const parsedHeaders: Record<string, string> = {}
      if (headers.trim()) {
        headers.split('\n').forEach(line => {
          const [k, ...v] = line.split(':')
          if (k && v.length) parsedHeaders[k.trim()] = v.join(':').trim()
        })
      }
      const opts: RequestInit = { method, headers: { ...parsedHeaders, 'Content-Type': 'application/json' } }
      if ((method === 'POST' || method === 'PUT') && body.trim()) {
        opts.body = body
      }
      const res = await fetch(url, opts)
      setStatus(res.status)
      const text = await res.text()
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2))
      } catch {
        setResponse(text)
      }
    } catch (e: any) {
      setError(e.message || 'Request failed')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">REST API Tester</h1>
      <div className="flex gap-2 mb-3">
        <select value={method} onChange={e => setMethod(e.target.value as Method)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono bg-white cursor-pointer">
          {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono" placeholder="https://api.example.com/endpoint" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button onClick={send} disabled={loading} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer">
          <Play size={16} /> {loading ? '...' : 'Send'}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Headers (Key: Value per line)</label>
          <textarea className="w-full h-28 border border-gray-300 rounded-lg p-3 text-sm font-mono" placeholder="Authorization: Bearer token" value={headers} onChange={e => setHeaders(e.target.value)} />
          {(method === 'POST' || method === 'PUT') && <>
            <label className="text-sm font-medium text-gray-700 mb-1 block mt-2">Request Body</label>
            <textarea className="w-full h-28 border border-gray-300 rounded-lg p-3 text-sm font-mono" placeholder='{"key": "value"}' value={body} onChange={e => setBody(e.target.value)} />
          </>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Response{status !== null && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100">{status}</span>}</label>
            {response && <button onClick={() => navigator.clipboard.writeText(response)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>}
          </div>
          <pre className="w-full h-60 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 overflow-auto font-mono whitespace-pre-wrap">{response || error || 'Click Send to see response'}</pre>
        </div>
      </div>
    </div>
  )
}
