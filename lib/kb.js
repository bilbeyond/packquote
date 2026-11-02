/**
 * 知识库：文件上传 → 解析 → 片段检索
 * 解析全部本地完成：docx 用自研解压器，txt/md/csv 直读，pdf 取纯文本（若有文本层）
 */
const path = require('path')
const store = require('./store.js')
const docx = require('./docx.js')

const KB_DIR = path.join(store.DATA, 'files')
const IO = store.IO

function ensureDir() {
  if (!IO.existsSync(KB_DIR)) IO.mkdirSync(KB_DIR)
}

/** 二进制 → 文本：Node 走 Buffer，浏览器走 TextDecoder / Uint8Array */
function bufToString(buf, enc) {
  if (buf == null) return ''
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buf)) return buf.toString(enc || 'utf8')
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  if (enc === 'latin1') {
    let s = ''
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
    return s
  }
  if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8').decode(u8)
  let s = ''
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
  return s
}

function sizeText(bytes) {
  const b = Number(bytes) || 0
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1024 / 1024).toFixed(1) + ' MB'
}

/* ---------------- 各格式解析 ---------------- */
function parseTxt(buf) {
  return { text: bufToString(buf, 'utf8'), method: '直接读取' }
}

function parsePdf(buf) {
  /* 取文本层：BT ... ET 之间 Tj/TJ 字符串，无文本层时提示 OCR */
  const raw = bufToString(buf, 'latin1')
  const chunks = []
  const re = /\((?:\\.|[^\\()])*\)/g
  let m
  let count = 0
  while ((m = re.exec(raw)) && count < 20000) {
    count++
    let s = m[0].slice(1, -1)
    if (s.indexOf('\\') === -1 && /^[\x20-\x7e]+$/.test(s)) chunks.push(s)
  }
  const text = chunks.join(' ').replace(/\s+/g, ' ').trim()
  if (!text || text.length < 20) {
    return { text: '', method: '扫描件 PDF，无文本层', unsupported: true }
  }
  return { text, method: '提取 PDF 文本层' }
}

function parseDoc(buf) {
  return {
    text: '',
    method: 'doc 为 97-2003 二进制格式',
    unsupported: true,
    message: '请在 Word 里另存为 .docx 后重新上传'
  }
}

function parseDocx(buf) {
  const res = docx.parseDocx(buf)
  return { text: res.text || '', method: '解压 word/document.xml 提取正文（段落 ' + res.paragraphs + '）' }
}

function parseFile(name, buf) {
  const ext = String(name).split('.').pop().toLowerCase()
  if (ext === 'docx') return parseDocx(buf)
  if (ext === 'doc') return parseDoc(buf)
  if (ext === 'pdf') return parsePdf(buf)
  if (['txt', 'md', 'csv', 'json', 'log'].indexOf(ext) > -1) return parseTxt(buf)
  return { text: '', unsupported: true, method: '暂不支持的格式', message: '支持 docx / txt / md / csv / pdf' }
}

/* ---------------- 入库 ---------------- */
function add(opts) {
  ensureDir()
  const list = store.getKb()
  const id = 'kb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
  const name = opts.name || '未命名文件'
  const buf = opts.buffer

  const parsed = parseFile(name, buf)
  const status = parsed.unsupported ? 'unsupported' : parsed.text ? 'done' : 'failed'

  const entry = {
    id,
    name,
    ext: String(name).split('.').pop().toLowerCase(),
    size: buf.length,
    sizeText: sizeText(buf.length),
    chars: parsed.text.length,
    status,
    statusText: status === 'done' ? '已解析' : status === 'unsupported' ? '需转档' : '解析失败',
    method: parsed.method,
    message: parsed.message || '',
    content: parsed.text,
    createdAt: Date.now(),
    createdText: timeText(Date.now())
  }

  if (parsed.text) {
    IO.writeFileSync(path.join(KB_DIR, id + '.txt'), parsed.text)
    entry.content = ''
  }

  list.unshift(entry)
  store.setKb(list)
  return entry
}

function timeText(ts) {
  const d = new Date(ts || Date.now())
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
}

function content(id) {
  const f = store.getKb().filter((x) => x.id === id)[0]
  if (!f) return ''
  const p = path.join(KB_DIR, id + '.txt')
  if (IO.existsSync(p)) return IO.readFileSync(p)
  return f.content || ''
}

function remove(id) {
  store.setKb(store.getKb().filter((f) => f.id !== id))
  const p = path.join(KB_DIR, id + '.txt')
  if (IO.existsSync(p)) IO.unlinkSync(p)
}

function list() {
  return store.getKb().map((f) => Object.assign({}, f, { content: undefined }))
}

/* ---------------- 检索：关键词打分 ---------------- */
function search(query, limit) {
  const q = String(query || '').trim()
  if (!q) return []

  /*
   * 中文没有空格，整句会被当成一个关键词而永远匹配不到。
   * 对长中文串按 2 字滑窗切分（如「汉堡盒食品级要求」→ 汉堡/堡盒/…/食品/…/要求），
   * 保证提问能命中知识库原文片段。
   */
  const keys = []
  q
    .replace(/[，。、；：？！,.;:?!]/g, ' ')
    .split(/\s+/)
    .filter((k) => k.length >= 2)
    .slice(0, 12)
    .forEach((k) => {
      if (/^[\u4e00-\u9fa5]{5,}$/.test(k)) {
        for (let i = 0; i + 2 <= k.length; i++) keys.push(k.slice(i, i + 2))
      } else {
        keys.push(k)
      }
    })
  if (!keys.length) return []

  const out = []
  store.getKb().forEach((f) => {
    if (f.status !== 'done') return
    const text = content(f.id)
    if (!text) return
    const lower = text.toLowerCase()
    let score = 0
    keys.forEach((k) => {
      let idx = lower.indexOf(k.toLowerCase())
      while (idx > -1) {
        score += 1
        idx = lower.indexOf(k.toLowerCase(), idx + 1)
        if (score > 40) break
      }
    })
    if (!score) return
    let snippet = ''
    const firstKey = keys[0]
    const pos = lower.indexOf(firstKey.toLowerCase())
    const start = Math.max(0, pos - 60)
    snippet = text.slice(start, start + 260).replace(/\n+/g, ' ')
    out.push({ id: f.id, name: f.name, score, snippet: (start > 0 ? '…' : '') + snippet + '…' })
  })

  out.sort((a, b) => b.score - a.score)
  return out.slice(0, limit || 3)
}

function stats() {
  const files = store.getKb()
  const done = files.filter((f) => f.status === 'done')
  return {
    total: files.length,
    done: done.length,
    chars: done.reduce((s, f) => s + (f.chars || 0), 0)
  }
}

module.exports = { add, list, remove, search, stats, content, parseFile, sizeText, timeText }
