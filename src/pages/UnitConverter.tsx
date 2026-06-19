import { useState } from 'react'

type Category = 'length' | 'weight' | 'temp' | 'data'

const units: Record<Category, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: 'Meters', toBase: v => v, fromBase: v => v },
    { label: 'Kilometers', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Miles', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    { label: 'Feet', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: 'Inches', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: 'Centimeters', toBase: v => v * 0.01, fromBase: v => v / 0.01 },
  ],
  weight: [
    { label: 'Kilograms', toBase: v => v, fromBase: v => v },
    { label: 'Grams', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
    { label: 'Pounds', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: 'Ounces', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  temp: [
    { label: 'Celsius', toBase: v => v, fromBase: v => v },
    { label: 'Fahrenheit', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { label: 'Kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  data: [
    { label: 'Bytes', toBase: v => v, fromBase: v => v },
    { label: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
    { label: 'MB', toBase: v => v * 1048576, fromBase: v => v / 1048576 },
    { label: 'GB', toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
  ],
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length')
  const [fromUnit, setFromUnit] = useState(0)
  const [toUnit, setToUnit] = useState(1)
  const [value, setValue] = useState('1')
  const catUnits = units[category]

  const result = value ? catUnits[toUnit].fromBase(catUnits[fromUnit].toBase(Number(value))) : 0

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit Converter</h1>
      <select value={category} onChange={e => { setCategory(e.target.value as Category); setFromUnit(0); setToUnit(1) }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 bg-white cursor-pointer">
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temp">Temperature</option>
        <option value="data">Data Storage</option>
      </select>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">From</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-1" />
          <select value={fromUnit} onChange={e => setFromUnit(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
            {catUnits.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">To</label>
          <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 mb-1">{Number.isInteger(result) ? result : result.toFixed(4)}</div>
          <select value={toUnit} onChange={e => setToUnit(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
            {catUnits.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
