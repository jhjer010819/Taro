import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const root = dirname(fileURLToPath(import.meta.url))
const skip = new Set(["node_modules", "dist", "public", ".git", "scripts"])

function htmlInputs(dir = root, acc = {}) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) htmlInputs(full, acc)
    else if (name.endsWith(".html")) {
      const key = full
        .slice(root.length + 1)
        .replaceAll("/", "-")
        .replace(/\.html$/, "")
      acc[key] = full
    }
  }
  return acc
}

function notFound() {
  const dist = join(root, "dist")
  return {
    name: "taro-404",
    configurePreviewServer(server) {
      const handler = (req, res, next) => {
        const url = decodeURIComponent((req.url ?? "/").split("?")[0])
        const rel = url === "/" ? "index.html" : url.replace(/^\//, "")
        const file = resolve(dist, rel)
        if (file !== dist && !file.startsWith(dist + sep)) {
          res.statusCode = 400
          res.end("bad path")
          return
        }
        if (existsSync(file) && statSync(file).isFile()) {
          next()
          return
        }
        res.statusCode = 404
        if (rel.includes(".") && !rel.endsWith(".html")) {
          res.end("not found")
          return
        }
        res.setHeader("content-type", "text/html; charset=utf-8")
        res.end(readFileSync(join(dist, "404.html")))
      }
      return () => {
        server.middlewares.use(handler)
      }
    },
  }
}

export default defineConfig({
  appType: "mpa",
  plugins: [notFound()],
  server: { host: "0.0.0.0", port: 4731, strictPort: true },
  preview: { host: "0.0.0.0", port: 4731, strictPort: true },
  build: {
    rollupOptions: {
      input: htmlInputs(),
    },
  },
})
