/**
 * 价目表维护：在内置 39+ 种材料基础上支持新增 / 编辑 / 删除 / CSV 导入导出
 * 自定义改动落在 data/materials.json，内置库不受污染
 */
const materials = require('./materials.js')
const store = require('./store.js')

function applyCustom() {
  const c = store.getCustom()
  const base = materials.MATERIALS
  return base
    .filter((m) => (c.deleted || []).indexOf(m.id) === -1)
    .map((m) => {
      const patch = (c.edited || {})[m.id]
      const merged = patch ? Object.assign({}, m, patch) : m
      if (merged.cat === 'paper' && merged.gram && merged.tonPrice) {
        merged.price = Math.round(((merged.gram * merged.tonPrice) / 1000000) * 100) / 100
      }
      return Object.assign({}, merged, { custom: !!patch })
    })
    .concat((c.added || []).map((m) => Object.assign({}, m, { custom: true })))
}

function viewAll() {
  return applyCustom().map((m) => materials.view(m))
}

function upsert(obj) {
  const c = store.getCustom()
  if (!obj || !obj.name) throw new Error('材料名称不能为空')

  if (obj.id && materials.getById(obj.id)) {
    const patch = {}
    Object.keys(obj).forEach((k) => {
      if (k !== 'id') patch[k] = obj[k]
    })
    c.edited = c.edited || {}
    c.edited[obj.id] = Object.assign({}, c.edited[obj.id], patch)
    store.setCustom(c)
    return Object.assign({}, materials.getById(obj.id), patch)
  }

  if (obj.id && (c.added || []).some((m) => m.id === obj.id)) {
    c.added = c.added.map((m) => (m.id === obj.id ? Object.assign({}, m, obj) : m))
    store.setCustom(c)
    return obj
  }

  const item = Object.assign(
    {
      id: 'u_' + Date.now().toString(36),
      cat: 'paper',
      sub: 'special',
      spec: '',
      unit: '元/㎡',
      supplier: '自定义',
      updated: new Date().toISOString().slice(0, 10),
      trend: 'flat',
      trendRate: 0,
      note: '自定义材料',
      alias: []
    },
    obj
  )
  if (item.cat === 'paper' && item.gram && item.tonPrice) {
    item.price = Math.round(((item.gram * item.tonPrice) / 1000000) * 100) / 100
  }
  c.added = (c.added || []).concat([item])
  store.setCustom(c)
  return item
}

function remove(id) {
  const c = store.getCustom()
  if ((c.added || []).some((m) => m.id === id)) {
    c.added = c.added.filter((m) => m.id !== id)
  } else {
    c.deleted = (c.deleted || []).concat([id])
    delete (c.edited || {})[id]
  }
  store.setCustom(c)
  return true
}

function reset() {
  store.setCustom({ added: [], edited: {}, deleted: [] })
  return true
}

/* ---------------- CSV ---------------- */
const HEADERS = ['名称', '分类', '子类', '规格', '单价', '单位', '供应商', '克重', '吨价', '别名', '备注']

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"'
        i++
      } else quoted = !quoted
    } else if (ch === ',' && !quoted) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function toCsv() {
  const rows = [HEADERS.join(',')]
  viewAll().forEach((m) => {
    rows.push(
      [
        m.name,
        m.cat,
        m.sub || '',
        m.spec || '',
        m.price,
        m.unit,
        m.supplier || '',
        m.gram || '',
        m.tonPrice || '',
        (materials.getById(m.id) && materials.getById(m.id).alias || []).join('|'),
        m.note || ''
      ]
        .map((v) => {
          const s = String(v == null ? '' : v)
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
        })
        .join(',')
    )
  })
  return rows.join('\n')
}

const CAT_ALIAS = { 纸类: 'paper', 塑料: 'plastic', 塑料类: 'plastic', 金属: 'metal', 金属类: 'metal', 缓冲: 'cushion', 缓冲材料: 'cushion', 辅料: 'aux' }

function importCsv(text) {
  const lines = String(text || '')
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim())
  if (!lines.length) throw new Error('CSV 为空')

  const head = parseCsvLine(lines[0])
  const idx = {}
  HEADERS.forEach((h) => {
    const i = head.indexOf(h)
    if (i > -1) idx[h] = i
  })
  if (idx['名称'] == null) throw new Error('CSV 缺少「名称」列')

  let ok = 0
  const errors = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const name = cols[idx['名称']]
    if (!name) {
      errors.push('第 ' + (i + 1) + ' 行缺名称')
      continue
    }
    const catRaw = cols[idx['分类']] || 'paper'
    const item = {
      name,
      cat: CAT_ALIAS[catRaw] || catRaw || 'paper',
      sub: cols[idx['子类']] || 'special',
      spec: cols[idx['规格']] || '',
      price: parseFloat(cols[idx['单价']] || '0') || 0,
      unit: cols[idx['单位']] || '元/㎡',
      supplier: cols[idx['供应商']] || '导入',
      gram: parseFloat(cols[idx['克重']] || '') || 0,
      tonPrice: parseFloat(cols[idx['吨价']] || '') || 0,
      alias: (cols[idx['别名']] || '').split('|').filter(Boolean),
      note: cols[idx['备注']] || 'CSV 导入'
    }
    if (item.cat === 'paper' && item.gram && item.tonPrice) {
      item.price = Math.round(((item.gram * item.tonPrice) / 1000000) * 100) / 100
    }
    try {
      upsert(item)
      ok++
    } catch (e) {
      errors.push('第 ' + (i + 1) + ' 行：' + e.message)
    }
  }
  return { ok, errors }
}

module.exports = { viewAll, upsert, remove, reset, toCsv, importCsv, HEADERS }
