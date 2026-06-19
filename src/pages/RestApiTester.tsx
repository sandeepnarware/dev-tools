import { useState, useEffect } from 'react'
import { Play, Copy, Plus, Trash2, History, X } from 'lucide-react'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
type HeaderPair = { key: string; value: string }

interface HistoryItem {
  id: string
  method: Method
  url: string
  headers: HeaderPair[]
  body: string
  response: string
  status: number | null
  timestamp: number
}

function loadHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem('devtools-rest-history')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem('devtools-rest-history', JSON.stringify(items))
}

export default function RestApiTester() {
  const [method, setMethod] = useState<Method>('GET')
  const [url, setUrl] = useState('')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState<HeaderPair[]>([{ key: '', value: '' }])
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => { saveHistory(history) }, [history])

  const updateHeader = (i: number, field: 'key' | 'value', val: string) => {
    const updated = headers.map((h, idx) => idx === i ? { ...h, [field]: val } : h)
    setHeaders(updated)
  }

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }])

  const removeHeader = (i: number) => {
    if (headers.length === 1) return
    setHeaders(headers.filter((_, idx) => idx !== i))
  }

  const send = async () => {
    if (!url) return
    setLoading(true)
    setError('')
    setResponse('')
    setStatus(null)
    try {
      const parsedHeaders: Record<string, string> = {}
      headers.forEach(h => { if (h.key.trim()) parsedHeaders[h.key.trim()] = h.value })
      const opts: RequestInit = { method, headers: { ...parsedHeaders } }
      if ((method === 'POST' || method === 'PUT') && body.trim()) {
        opts.body = body
      }
      const res = await fetch(url, opts)
      setStatus(res.status)
      const text = await res.text()
      let formatted = text
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2)
      } catch { /* not json */ }
      setResponse(formatted)

      const entry: HistoryItem = {
        id: crypto.randomUUID(),
        method,
        url,
        headers: headers.filter(h => h.key.trim()),
        body,
        response: formatted,
        status: res.status,
        timestamp: Date.now(),
      }
      setHistory(prev => [entry, ...prev].slice(0, 50))
    } catch (e: any) {
      setError(e.message || 'Request failed')
    }
    setLoading(false)
  }

  const loadFromHistory = (item: HistoryItem) => {
    setMethod(item.method)
    setUrl(item.url)
    setHeaders(item.headers.length ? item.headers : [{ key: '', value: '' }])
    setBody(item.body)
    setResponse(item.response)
    setStatus(item.status)
    setError('')
    setShowHistory(false)
  }

  const clearHistory = () => setHistory([])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">REST API Tester</h1>
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
          <History size={16} /> History ({history.length})
        </button>
      </div>

      {showHistory && (
        <div className="mb-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">Request History</span>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 cursor-pointer">Clear All</button>
              )}
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No requests yet</p>
            ) : (
              history.map(item => (
                <button key={item.id} onClick={() => loadFromHistory(item)} className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${methodColor(item.method)}`}>{item.method}</span>
                    <span className="text-sm font-mono text-gray-700 truncate flex-1">{item.url}</span>
                    {item.status && <span className={`text-xs font-mono ${item.status < 400 ? 'text-green-600' : 'text-red-500'}`}>{item.status}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

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
          <label className="text-sm font-medium text-gray-700 mb-1 block">Headers</label>
          <div className="space-y-1.5 mb-3">
            {headers.map((h, i) => (
              <div key={i} className="flex gap-1">
                <input
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  placeholder="Key"
                  value={h.key}
                  onChange={e => updateHeader(i, 'key', e.target.value)}
                />
                <input
                  className="flex-[2] border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  placeholder="Value"
                  value={h.value}
                  onChange={e => updateHeader(i, 'value', e.target.value)}
                />
                <button onClick={() => removeHeader(i)} className="text-gray-400 hover:text-red-500 cursor-pointer p-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <button onClick={addHeader} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer mb-3"><Plus size={14} /> Add Header</button>

          {(method === 'POST' || method === 'PUT') && <>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Request Body</label>
            <textarea className="w-full h-28 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder='{"key": "value"}' value={body} onChange={e => setBody(e.target.value)} />
          </>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Response{status !== null && <span className={`ml-2 text-xs px-2 py-0.5 rounded font-mono ${status < 400 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status}</span>}</label>
            {response && <button onClick={() => navigator.clipboard.writeText(response)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={16} /></button>}
          </div>
          <pre className="w-full h-72 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 overflow-auto font-mono whitespace-pre-wrap">{response || error || 'Click Send to see response'}</pre>
        </div>
      </div>
    </div>
  )
}

function methodColor(m: Method): string {
  const map: Record<Method, string> = {
    GET: 'bg-green-100 text-green-700',
    POST: 'bg-blue-100 text-blue-700',
    PUT: 'bg-amber-100 text-amber-700',
    DELETE: 'bg-red-100 text-red-700',
  }
  return map[m]
}
