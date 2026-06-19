import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

const Notes = lazy(() => import('./pages/Notes'))
const SqlFormatter = lazy(() => import('./pages/SqlFormatter'))
const SqlExplain = lazy(() => import('./pages/SqlExplain'))
const RestApiTester = lazy(() => import('./pages/RestApiTester'))
const JwtDecoder = lazy(() => import('./pages/JwtDecoder'))
const JsonTools = lazy(() => import('./pages/JsonTools'))
const GuidGenerator = lazy(() => import('./pages/GuidGenerator'))
const HashGenerator = lazy(() => import('./pages/HashGenerator'))
const Base64Encoder = lazy(() => import('./pages/Base64Encoder'))
const UnitConverter = lazy(() => import('./pages/UnitConverter'))
const ColorPicker = lazy(() => import('./pages/ColorPicker'))
const QrGenerator = lazy(() => import('./pages/QrGenerator'))
const PasswordGenerator = lazy(() => import('./pages/PasswordGenerator'))
const TextCaseConverter = lazy(() => import('./pages/TextCaseConverter'))

function Loading() {
  return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading...</div>
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/sql-formatter" element={<SqlFormatter />} />
          <Route path="/sql-explain" element={<SqlExplain />} />
          <Route path="/rest-api" element={<RestApiTester />} />
          <Route path="/jwt" element={<JwtDecoder />} />
          <Route path="/json-tools" element={<JsonTools />} />
          <Route path="/guid" element={<GuidGenerator />} />
          <Route path="/hash" element={<HashGenerator />} />
          <Route path="/base64" element={<Base64Encoder />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/qr" element={<QrGenerator />} />
          <Route path="/password" element={<PasswordGenerator />} />
          <Route path="/text-case" element={<TextCaseConverter />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
