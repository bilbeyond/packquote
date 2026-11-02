/* 端到端接口自检：node test-api.js（需先启动服务） */
const fs = require('fs')
const path = require('path')

const BASE = process.env.BASE || 'http://127.0.0.1:5173'
let pass = 0
let fail = 0

function ok(name, cond, extra) {
  if (cond) {
    pass++
    console.log('  ✓', name, extra || '')
  } else {
    fail++
    console.log('  ✗', name, extra || '')
  }
}

async function get(u) {
  const r = await fetch(BASE + u)
  return r.json()
}
async function post(u, body) {
  const r = await fetch(BASE + u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body || {})
  })
  return r.json()
}
async function del(u) {
  const r = await fetch(BASE + u, { method: 'DELETE' })
  return r.json()
}

/* 简易 SSE 读取 */
async function sse(text) {
  const r = await fetch(BASE + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ text, history: [] })
  })
  const reader = r.body.getReader()
  const dec = new TextDecoder('utf-8')
  let buf = ''
  let meta = null
  let full = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const l of lines) {
      const s = l.trim()
      if (!s.startsWith('data:')) continue
      try {
        const ev = JSON.parse(s.slice(5).trim())
        if (ev.type === 'meta') meta = ev.payload
        if (ev.type === 'delta') full += ev.payload
      } catch (e) {}
    }
  }
  return { meta, full }
}

;(async () => {
  console.log('=== 1. 状态 ===')
  const st = await get('/api/state')
  ok('场景库非空', st.scenes.length >= 6, st.scenes.length + ' 个场景')
  ok('价目库已加载', st.stats.materials >= 39, st.stats.materials + ' 种材料')

  console.log('=== 2. 场景推荐对话 ===')
  const burger = await sse('我要做一个汉堡的包装，5000个')
  ok('识别汉堡场景', burger.meta && burger.meta.scene && burger.meta.scene.id === 'burger')
  const plans = (burger.meta.rec || {}).plans || []
  ok('三档方案', plans.length === 3)
  ok('单价递增', plans.length === 3 && plans[0].unitPrice < plans[2].unitPrice,
    plans.map((p) => p.tierName + ' ¥' + p.unitPriceText).join(' / '))
  ok('回答含合规提示', burger.full.indexOf('GB 4806') > -1)
  ok('配件计入', (burger.meta.rec.accessories || []).length > 0)

  const drink = await sse('奶茶杯托 4 格，20000 个')
  ok('识别饮品场景', drink.meta && drink.meta.scene && drink.meta.scene.id === 'drink')

  const direct = await sse('200×150×100mm 三层瓦楞 5000 个')
  ok('直接报价可用', direct.full.indexOf('合计') > -1)

  console.log('=== 3. 知识库 ===')
  const docxPath = path.join(__dirname, '..', 'baozhuang-quote', 'sample.docx')
  if (fs.existsSync(docxPath)) {
    const b64 = fs.readFileSync(docxPath).toString('base64')
    const up = await post('/api/kb/upload', { name: '包装材料报价规则.docx', base64: b64 })
    ok('docx 上传解析', up.ok && up.item && up.item.status === 'done', up.item && up.item.chars + ' 字')
    const lst = await get('/api/kb')
    ok('列表返回', lst.list.length > 0)
    const c = await get('/api/kb/content?id=' + encodeURIComponent(up.item.id))
    ok('正文可取', (c.content || '').length > 20)
    await del('/api/kb?id=' + encodeURIComponent(up.item.id))
    const after = await get('/api/kb')
    ok('删除生效', after.list.length === lst.list.length - 1)
  } else {
    console.log('  - 跳过（无 sample.docx）')
  }
  const bad = await post('/api/kb/upload', { name: '老格式.doc', base64: Buffer.from('x').toString('base64') })
  ok('doc 提示转档', bad.item && bad.item.status === 'unsupported', bad.item && bad.item.message)
  await del('/api/kb?id=' + encodeURIComponent(bad.item.id))

  console.log('=== 4. 价目表 ===')
  const add = await post('/api/materials', {
    name: '测试材料 250g',
    cat: 'paper',
    sub: 'special',
    spec: '250g 测试',
    unit: '元/㎡',
    gram: 250,
    tonPrice: 8000,
    supplier: '自检'
  })
  ok('新增材料', add.ok && add.item && Math.abs(add.item.price - 2) < 0.01, add.item && add.item.priceText + ' 元/㎡')
  await del('/api/materials?id=' + encodeURIComponent(add.item.id))
  const ms = await get('/api/materials')
  ok('删除后价目恢复', ms.list.length === st.stats.materials, ms.list.length + ' 种')

  const csv = '名称,分类,子类,规格,单价,单位,供应商,克重,吨价,别名,备注\n自检纸杯纸,纸类,特种纸,单面淋膜 260g,,元/㎡,自检,260,9000,杯纸|淋膜,自检导入\n'
  const imp = await post('/api/materials/import', { csv })
  ok('CSV 导入', imp.ok && imp.result.ok === 1, JSON.stringify(imp.result && imp.result.errors))
  await post('/api/materials/reset', {})
  const afterReset = await get('/api/materials')
  ok('恢复内置', afterReset.list.length === st.stats.materials)

  console.log('=== 5. 报价单 ===')
  const q = await post('/api/quotes', {
    sceneName: '汉堡包装',
    primaryName: '汉堡折叠盒',
    materialName: '食品级白卡 350g',
    sizeText: '130×130×85mm',
    qty: 5000,
    qtyText: '5,000',
    unitPriceText: '0.56',
    goodsAmountText: '2,800.00',
    oneTimeText: '1,040.00',
    totalText: '4,261.36',
    createdText: '2026-11-02 12:00'
  })
  ok('保存报价单', q.ok && q.item && q.item.id)
  const ql = await get('/api/quotes')
  ok('列表可见', ql.list.length > 0)
  const exp = await fetch(BASE + '/api/quotes/export')
  const expText = await exp.text()
  ok('CSV 导出', expText.indexOf('汉堡包装') > -1 && expText.split('\n').length > 1)
  await del('/api/quotes?id=' + encodeURIComponent(q.item.id))

  console.log('=== 6. 配置 ===')
  const cfg = await post('/api/config', { llm: { enabled: false } })
  ok('配置保存', cfg && cfg.llm && cfg.llm.enabled === false)
  ok('Key 已脱敏', !cfg.llm.apiKey)

  console.log('\n通过 ' + pass + ' / ' + (pass + fail))
  process.exit(fail ? 1 : 0)
})().catch((e) => {
  console.error('自检异常：', e)
  process.exit(1)
})
