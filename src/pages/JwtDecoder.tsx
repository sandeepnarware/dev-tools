import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [info, setInfo] = useState<{ exp?: string; iss?: string; sub?: string }>({})

  const decode = () => {
    try {
      const h = jwtDecode(token, { header: true })
      const p = jwtDecode(token)
      setHeader(JSON.stringify(h, null, 2))
      setPayload(JSON.stringify(p, null, 2))
      const exp = (p as any).exp ? new Date((p as any).exp * 1000).toLocaleString() : undefined
      setInfo({ exp, iss: (p as any).iss, sub: (p as any).sub })
    } catch {
      setHeader('Invalid JWT')
      setPayload('Invalid JWT')
      setInfo({})
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">JWT Decoder</h1>
      <textarea
        className="w-full h-24 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Paste your JWT token here..."
        value={token}
        onChange={e => setToken(e.target.value)}
      />
      <button onClick={decode} className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">Decode</button>
      {info.exp && (
        <div className="mt-3 flex gap-4 text-sm text-gray-600">
          {info.iss && <span>Issuer: <strong>{info.iss}</strong></span>}
          {info.sub && <span>Subject: <strong>{info.sub}</strong></span>}
          {info.exp && <span>Expires: <strong>{info.exp}</strong></span>}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Header</label>
          <pre className="w-full h-40 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 overflow-auto font-mono whitespace-pre-wrap">{header}</pre>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Payload</label>
          <pre className="w-full h-40 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 overflow-auto font-mono whitespace-pre-wrap">{payload}</pre>
        </div>
      </div>
    </div>
  )
}
