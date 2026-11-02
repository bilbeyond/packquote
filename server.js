/**
 * 包装材料报价智能体 · 网站版
 * 零依赖 Node HTTP 服务：静态托管 + 报价 / 推荐 / 知识库 / 价目表 API
 * 启动：node server.js  （默认 http://localhost:5173）
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const ROOT = __dirname
const PUBLIC = path.join(ROOT, 'public')
const PORT = process.env.PORT || 5173

const engine = require('./lib/quote-engine.js')
const materials = require('./lib/materials.js')
const recommend = require('./lib/recommend.js')
const pricelist = require('./lib/pricelist.js')
const store = require('./lib/store.js')
const kb = require('./lib/kb.js')
const llm = require('./lib/llm.js')
const { createService } = require('./lib/service.js')

store.ensure()

/* 业务服务层：与 GitHub Pages 静态版共用同一份逻辑 */
const svc = createService({ engine, materials, recommend, pricelist, store, kb, llm })

/* ===================== 工具 ===================== */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
}

function send(res, code, data, headers) {
  const body = data == null ? '' : typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data)
  res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, headers || {}))
  res.end(body)
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const max = limit || 12 * 1024 * 1024
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > max) {
        reject(new Error('请求体过大（上限 12MB）'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function json(req) {
  return readBody(req).then((buf) => (buf.length ? JSON.parse(buf.toString('utf8')) : {}))
}

/* ===================== 静态文件 ===================== */
function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname)
  if (rel === '/' || rel === '') rel = '/index.html'
  const file = path.join(PUBLIC, path.normalize(rel).replace(/^([/\\])+/, ''))
  if (!file.startsWith(PUBLIC)) return send(res, 403, { error: 'forbidden' })
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, { error: 'not found' })
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    })
    res.end(data)
  })
}

/* ===================== 对话核心 ===================== */
async function handleChat(req, res) {
  const body = await json(req)

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  })

  const emit = (type, payload) => {
    res.write('data: ' + JSON.stringify({ type, payload }) + '\n\n')
  }

  try {
    await svc.chat(body, emit)
  } catch (e) {
    emit('notice', { level: 'error', message: '服务异常：' + e.message })
  }
  res.end()
}

/* ===================== 路由 ===================== */
const routes = {
  'GET /api/state': async (req, res) => send(res, 200, svc.state()),

  'GET /api/config': async (req, res) => send(res, 200, svc.getConfig()),
  'POST /api/config': async (req, res) => send(res, 200, svc.setConfig(await json(req))),
  'POST /api/llm/test': async (req, res) => send(res, 200, await svc.testLLM()),

  'POST /api/chat': handleChat,

  'GET /api/materials': async (req, res) => send(res, 200, svc.materials.list()),
  'POST /api/materials': async (req, res) => send(res, 200, svc.materials.upsert(await json(req))),
  'DELETE /api/materials': async (req, res) => {
    const q = url.parse(req.url, true).query
    send(res, 200, svc.materials.remove(q.id))
  },
  'POST /api/materials/reset': async (req, res) => send(res, 200, svc.materials.reset()),
  'GET /api/materials/export': async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="materials.csv"'
    })
    res.end(svc.materials.exportCsv())
  },
  'POST /api/materials/import': async (req, res) => {
    const body = await json(req)
    send(res, 200, svc.materials.importCsv(body.csv || ''))
  },

  'GET /api/quotes': async (req, res) => send(res, 200, svc.quotes.list()),
  'POST /api/quotes': async (req, res) => send(res, 200, svc.quotes.add(await json(req))),
  'DELETE /api/quotes': async (req, res) => {
    const q = url.parse(req.url, true).query
    send(res, 200, svc.quotes.remove(q.id))
  },
  'GET /api/quotes/export': async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="quotes.csv"'
    })
    res.end(svc.quotes.exportCsv())
  },

  'GET /api/kb': async (req, res) => send(res, 200, svc.kb.list()),
  'POST /api/kb/upload': async (req, res) => send(res, 200, svc.kb.upload(await json(req))),
  'DELETE /api/kb': async (req, res) => {
    const q = url.parse(req.url, true).query
    send(res, 200, svc.kb.remove(q.id))
  },
  'GET /api/kb/content': async (req, res) => {
    const q = url.parse(req.url, true).query
    send(res, 200, svc.kb.content(q.id))
  },

  'GET /api/scenes': async (req, res) => send(res, 200, svc.scenes())
}

const server = http.createServer(async (req, res) => {
  const u = url.parse(req.url, true)
  const pathname = u.pathname
  const key = req.method + ' ' + pathname

  try {
    if (routes[key]) return await routes[key](req, res)
    if (pathname === '/api/chat' && req.method === 'POST') return await handleChat(req, res)
    if (pathname.startsWith('/api/')) return send(res, 404, { error: 'api not found: ' + pathname })
    return serveStatic(req, res, pathname)
  } catch (e) {
    if (!res.headersSent) return send(res, 500, { error: e.message })
    try {
      res.end()
    } catch (x) {}
  }
})

server.listen(PORT, () => {
  console.log('')
  console.log('  包装材料报价智能体 · 网站版')
  console.log('  ------------------------------------------')
  console.log('  访问地址： http://localhost:' + PORT)
  console.log('  数据目录： ' + store.DATA)
  const cfg = store.getConfig(true)
  console.log('  大模型：   ' + (llm.ready() ? '已启用 ' + cfg.llm.model : '未配置（本地引擎可用）'))
  console.log('')
})
