import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Copy } from 'lucide-react'

export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1')

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Color Picker</h1>
      <div className="flex gap-8 items-start">
        <HexColorPicker color={color} onChange={setColor} />
        <div className="space-y-3">
          <div className="w-24 h-24 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
          <div className="space-y-1">
            {['HEX', 'RGB'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">{label}</span>
                <code className="text-sm font-mono">{i === 0 ? color : hexToRgb(color)}</code>
                <button onClick={() => navigator.clipboard.writeText(i === 0 ? color : hexToRgb(color))} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
