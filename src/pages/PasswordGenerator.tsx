import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')

  const generate = () => {
    let chars = ''
    if (upper) chars += UPPER
    if (lower) chars += LOWER
    if (digits) chars += DIGITS
    if (symbols) chars += SYMBOLS
    if (!chars) return

    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
  }

  const getStrength = () => {
    let score = 0
    if (upper) score++
    if (lower) score++
    if (digits) score++
    if (symbols) score++
    score += Math.floor(length / 4)
    if (score < 3) return { label: 'Weak', color: 'bg-red-500', width: '25%' }
    if (score < 5) return { label: 'Medium', color: 'bg-amber-500', width: '50%' }
    if (score < 7) return { label: 'Strong', color: 'bg-yellow-500', width: '75%' }
    return { label: 'Very Strong', color: 'bg-green-500', width: '100%' }
  }

  const strength = getStrength()

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Generator</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" readOnly value={password} placeholder="Click Generate" />
          <button onClick={generate} className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 cursor-pointer"><RefreshCw size={18} /></button>
          <button onClick={() => navigator.clipboard.writeText(password)} className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"><Copy size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
          </div>
          <span className="text-xs text-gray-500 w-20 text-right">{strength.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Length: {length}</label>
          <input type="range" min={4} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="flex-1 cursor-pointer" />
        </div>
        <div className="flex gap-4 flex-wrap">
          {[
            { label: 'A-Z', key: 'upper', value: upper, set: setUpper },
            { label: 'a-z', key: 'lower', value: lower, set: setLower },
            { label: '0-9', key: 'digits', value: digits, set: setDigits },
            { label: '!@#$', key: 'symbols', value: symbols, set: setSymbols },
          ].map(({ label, key, value, set }) => (
            <label key={key} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={value} onChange={() => set(!value)} className="cursor-pointer" />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
