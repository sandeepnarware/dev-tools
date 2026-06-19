import { useState } from 'react'
import { AlertTriangle, Info, Lightbulb } from 'lucide-react'

export default function SqlExplain() {
  const [query, setQuery] = useState('')
  const [analysis, setAnalysis] = useState<{ joins: string[]; tips: string[]; indexes: string[]; warnings: string[] } | null>(null)

  const analyze = () => {
    const q = query.toUpperCase()
    const joins: string[] = []
    const tips: string[] = []
    const indexes: string[] = []
    const warnings: string[] = []

    if (q.includes('JOIN')) {
      joins.push('Query uses JOIN operations')
      if (q.includes('SELECT *')) tips.push('Avoid SELECT * with JOINs - specify only needed columns')
      joins.push('Ensure join columns are indexed')
    }
    if (!q.includes('WHERE')) {
      warnings.push('No WHERE clause detected - this may scan all rows')
    }
    if (q.includes('WHERE') && !q.includes('INDEX')) {
      indexes.push('Consider indexing columns used in WHERE clause')
    }
    if (q.includes('LIKE')) {
      warnings.push('LIKE with leading wildcard (%) cannot use indexes efficiently')
      tips.push('Consider full-text search for better performance')
    }
    if (q.includes('ORDER BY') || q.includes('GROUP BY')) {
      tips.push('Large sorts may use temp files - consider limiting result set')
    }
    if (q.includes('SELECT *')) {
      warnings.push('SELECT * returns all columns - specify only needed columns')
    }
    if (q.includes('NOT IN')) {
      tips.push('NOT IN can be slow - consider NOT EXISTS or LEFT JOIN ... IS NULL')
    }
    if (q.includes('OR')) {
      tips.push('OR conditions may not use indexes effectively - consider UNION')
    }
    if (!joins.length) joins.push('No JOINs detected')
    if (!indexes.length) indexes.push('No obvious indexing suggestions')
    if (!tips.length) tips.push('Query looks straightforward')

    setAnalysis({ joins, tips, indexes, warnings })
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">SQL Explain Generator</h1>
      <textarea
        className="w-full h-40 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Paste your SQL query here..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={analyze} className="mt-3 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm cursor-pointer">
        Analyze Query
      </button>
      {analysis && (
        <div className="mt-4 space-y-3">
          <Section icon={Info} title="JOIN Analysis" color="blue" items={analysis.joins} />
          <Section icon={Lightbulb} title="Execution Tips" color="amber" items={analysis.tips} />
          <Section icon={Info} title="Indexing Suggestions" color="green" items={analysis.indexes} />
          <Section icon={AlertTriangle} title="Warnings" color="red" items={analysis.warnings} />
        </div>
      )}
    </div>
  )
}

function Section({ icon: Icon, title, color, items }: { icon: any; title: string; color: string; items: string[] }) {
  const colors: Record<string, string> = { blue: 'text-blue-700 bg-blue-50 border-blue-200', amber: 'text-amber-700 bg-amber-50 border-amber-200', green: 'text-green-700 bg-green-50 border-green-200', red: 'text-red-700 bg-red-50 border-red-200' }
  const c = colors[color] || colors.blue
  return (
    <div className={`rounded-lg border p-3 ${c}`}>
      <h3 className="font-medium flex items-center gap-2 text-sm mb-1"><Icon size={16} />{title}</h3>
      <ul className="text-sm space-y-0.5">
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  )
}
