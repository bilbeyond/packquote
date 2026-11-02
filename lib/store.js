/**
 * 轻量持久化：JSON 文件存储，零依赖
 * 存放内容：大模型配置、报价单、知识库索引、自定义价目
 */
const fs = require('fs')
const path = require('path')

/* 浏览器环境无 __dirname，此时 DATA 仅为逻辑路径（真实存储由 setIO 决定） */
const DATA = typeof __dirname !== 'undefined' ? path.join(__dirname, '..', 'data') : path.join('data')
const FILES = {
  config: path.join(DATA, 'config.json'),
  quotes: path.join(DATA, 'quotes.json'),
  kb: path.join(DATA, 'kb.json'),
  materials: path.join(DATA, 'materials.json')
}

/**
 * 存储后端：默认 Node 文件系统；浏览器（GitHub Pages 静态版）由 web-io.js
 * 注入 localStorage 实现，业务代码保持不变。
 */
const IO = {
  existsSync: (p) => fs.existsSync(p),
  mkdirSync: (p) => fs.mkdirSync(p, { recursive: true }),
  readFileSync: (p) => fs.readFileSync(p, 'utf8'),
  writeFileSync: (p, d) => fs.writeFileSync(p, d, 'utf8'),
  unlinkSync: (p) => fs.unlinkSync(p)
}

function setIO(next) {
  Object.keys(next || {}).forEach((k) => {
    IO[k] = next[k]
  })
}

function ensure() {
  if (!IO.existsSync(DATA)) IO.mkdirSync(DATA)
  const dir = path.join(DATA, 'files')
  if (!dir) return
  if (!IO.existsSync(dir)) IO.mkdirSync(dir)
}

function read(name, def) {
  ensure()
  try {
    if (!IO.existsSync(FILES[name])) return def
    const raw = IO.readFileSync(FILES[name])
    return raw ? JSON.parse(raw) : def
  } catch (e) {
    return def
  }
}

function write(name, val) {
  ensure()
  IO.writeFileSync(FILES[name], JSON.stringify(val, null, 2))
  return true
}

/* ---------------- 配置 ---------------- */
const DEFAULT_CONFIG = {
  llm: {
    enabled: false,
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    model: 'deepseek-chat',
    temperature: 0.4,
    maxTokens: 1600,
    timeoutMs: 45000
  },
  defaults: { qty: 2000 }
}

function getConfig(internal) {
  const c = read('config', DEFAULT_CONFIG)
  const cfg = Object.assign({}, DEFAULT_CONFIG, c, {
    llm: Object.assign({}, DEFAULT_CONFIG.llm, (c && c.llm) || {})
  })
  if (!internal && cfg.llm.apiKey) {
    const k = cfg.llm.apiKey
    cfg.llm.apiKeyMasked = k.slice(0, 6) + '****' + k.slice(-4)
    cfg.llm.apiKey = ''
    cfg.llm.hasKey = true
  } else {
    cfg.llm.hasKey = !!(c && c.llm && c.llm.apiKey)
  }
  return cfg
}

function setConfig(patch) {
  const cur = getConfig(true)
  const next = Object.assign({}, cur, patch || {}, {
    llm: Object.assign({}, cur.llm, (patch && patch.llm) || {})
  })
  write('config', next)
  return getConfig()
}

/* ---------------- 报价单 ---------------- */
function getQuotes() {
  return read('quotes', [])
}

function addQuote(q) {
  const list = getQuotes()
  const item = Object.assign({}, q, { id: 'q_' + Date.now(), createdAt: Date.now() })
  list.unshift(item)
  write('quotes', list.slice(0, 200))
  return item
}

function removeQuote(id) {
  write('quotes', getQuotes().filter((q) => q.id !== id))
}

/* ---------------- 知识库索引 ---------------- */
function getKb() {
  return read('kb', [])
}

function setKb(list) {
  write('kb', list)
}

/* ---------------- 自定义价目 ---------------- */
function getCustom() {
  return read('materials', { added: [], edited: {}, deleted: [] })
}

function setCustom(c) {
  write('materials', c)
}

module.exports = {
  DATA,
  FILES,
  IO,
  setIO,
  ensure,
  read,
  write,
  getConfig,
  setConfig,
  getQuotes,
  addQuote,
  removeQuote,
  getKb,
  setKb,
  getCustom,
  setCustom
}
