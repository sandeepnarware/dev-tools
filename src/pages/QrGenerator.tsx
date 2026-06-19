import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QrGenerator() {
  const [text, setText] = useState('https://github.com')
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, { width: size, margin: 2 }, err => {
        if (err) console.error(err)
      })
    }
  }, [text, size])

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">QR Generator</h1>
      <div className="flex gap-3 mb-4">
        <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono" value={text} onChange={e => setText(e.target.value)} placeholder="Text or URL..." />
        <select value={size} onChange={e => setSize(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
          <option value={128}>128px</option>
          <option value={256}>256px</option>
          <option value={512}>512px</option>
        </select>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 inline-block">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
