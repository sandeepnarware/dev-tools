import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same-origin proxy so the in-browser REST tester can call any API without
// being blocked by CORS. The browser talks to the dev server (same origin),
// and the dev server makes the real request server-side and relays it back.
function restProxyPlugin(): Plugin {
  return {
    name: 'rest-api-proxy',
    configureServer(server) {
      server.middlewares.use('/__rest_proxy', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const { url, method, headers, body } = JSON.parse(
            Buffer.concat(chunks).toString('utf-8') || '{}'
          )

          const init: RequestInit = { method, headers: headers || {} }
          if (body && method !== 'GET' && method !== 'HEAD') init.body = body

          const upstream = await fetch(url, init)
          const text = await upstream.text()

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              status: upstream.status,
              statusText: upstream.statusText,
              body: text,
            })
          )
        } catch (e) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: e instanceof Error ? e.message : 'Proxy request failed',
            })
          )
        }
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), restProxyPlugin()],
})
