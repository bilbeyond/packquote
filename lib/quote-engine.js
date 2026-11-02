/**
 * 报价引擎
 * ------------------------------------------------------------------
 * 输入一句自然语言 → 解析材料 / 尺寸 / 数量 / 印刷色数 / 后道工艺
 * → 计算展开面积 → 逐项成本 → 数量阶梯 → 输出结构化报价 + 话术
 *
 * 全部在本地完成，不依赖网络，结果可复算、可追溯。
 * ------------------------------------------------------------------
 */

const materials = require('./materials.js')

/* ===================== 文本归一化 ===================== */

const PUNCT_MAP = {
  '，': ',', '。': '.', '；': ';', '：': ':', '！': '!', '？': '?', '、': ',',
  '（': '(', '）': ')', '【': '[', '】': ']', '「': '"', '」': '"',
  '“': '"', '”': '"', '‘': "'", '’': "'", '～': '~', '－': '-', '—': '-'
}

function normalize(text) {
  let s = String(text == null ? '' : text)
  // 全角字符转半角
  s = s.replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
  s = s.replace(/\u3000/g, ' ')
  // 中文标点
  s = s.replace(/[，。；：！？、【】「」“”‘’～－—]/g, (ch) => PUNCT_MAP[ch] || ch)
  return s.toLowerCase()
}

/* ===================== 数字与单位 ===================== */

const NUM = '\\d+(?:\\.\\d+)?'
const UNIT_SRC = '(?:mm|毫米|cm|厘米|米|m)'

/** 判断尺寸单位 → 换算到毫米的系数 */
function unitFactor(seg) {
  const s = String(seg || '').toLowerCase()
  if (/cm|厘米/.test(s)) return 10
  const cleaned = s.replace(/mm|毫米/g, '')
  if (/米/.test(cleaned)) return 1000
  return 1
}

/** 解析尺寸，统一返回毫米 */
function parseSize(text) {
  const t = String(text || '')

  // 形式一：200×150×100 / 200*150*100mm / 200mm x 150mm
  const re1 = new RegExp(
    '(' + NUM + ')\\s*' + UNIT_SRC + '?\\s*[*x×✕·]\\s*(' + NUM + ')\\s*' + UNIT_SRC +
      '?(?:\\s*[*x×✕·]\\s*(' + NUM + ')\\s*' + UNIT_SRC + '?)?',
    'i'
  )
  let m = t.match(re1)
  if (m) {
    const f = unitFactor(m[0])
    const nums = [m[1], m[2], m[3]]
      .filter((v) => v !== undefined && v !== '')
      .map((v) => parseFloat(v) * f)
    if (nums.length >= 2 && nums.every((n) => n > 0 && n <= 4000)) {
      return {
        l: nums[0],
        w: nums[1],
        h: nums[2] || 0,
        factor: f,
        raw: m[0].trim(),
        dims: nums.length
      }
    }
  }

  // 形式二：长200 宽150 高100
  const re2 = /长(?:度)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(mm|毫米|cm|厘米|米)?\D{0,10}?宽(?:度)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(mm|毫米|cm|厘米|米)?(?:\D{0,10}?高(?:度)?\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(mm|毫米|cm|厘米|米)?)?/i
  m = t.match(re2)
  if (m) {
    const f = unitFactor((m[2] || '') + (m[4] || '') + (m[6] || ''))
    const l = parseFloat(m[1]) * f
    const w = parseFloat(m[3]) * f
    const h = m[5] ? parseFloat(m[5]) * f : 0
    if (l > 0 && w > 0 && l <= 4000 && w <= 4000) {
      return { l, w, h, factor: f, raw: m[0].trim(), dims: h ? 3 : 2 }
    }
  }

  return null
}

/** 解析数量 */
function parseQty(text) {
  const t = String(text || '')
  let m = t.match(/(\d+(?:\.\d+)?)\s*万\s*(?:个|只|件|pcs|套|张|条|份|箱)?/i)
  if (m) return Math.round(parseFloat(m[1]) * 10000)

  m = t.match(/(\d[\d,]{0,9})\s*(个|只|件|pcs|套|张|条|份|箱|pcs)/i)
  if (m) return parseInt(m[1].replace(/,/g, ''), 10)

  m = t.match(/(?:数量|共|做|要|订|采购)\s*[:：]?\s*(\d[\d,]{0,9})/)
  if (m) return parseInt(m[1].replace(/,/g, ''), 10)

  return null
}

/** 解析印刷色数 */
const CN_NUM = { 单: 1, 一: 1, 二: 2, 两: 2, 双: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8 }

function parseColors(text) {
  const t = String(text || '')
  if (/不印刷|无需印刷|无印刷|素色|无印|不印/.test(t)) return 0

  let m = t.match(/(\d+)\s*色/)
  if (m) return Math.min(parseInt(m[1], 10), 8)

  m = t.match(/([单一二两双三四五六七八])\s*色/)
  if (m) return CN_NUM[m[1]] || 4

  if (/全彩|彩印|彩色印刷|四色/.test(t)) return 4
  if (/印刷|印logo|印图/.test(t)) return 4
  return 0
}

/* ===================== 后道工艺 ===================== */

const CRAFTS = [
  { key: 'film', name: '覆膜（光/哑）', re: /覆膜|哑膜|亮膜|过膜|贴膜/, mode: 'sqm', price: 0.45 },
  { key: 'hot', name: '烫金 / 烫银', re: /烫金|烫银|烫印|烫金logo/, mode: 'sqm', price: 0.85 },
  { key: 'uv', name: '局部 UV', re: /局部uv|uv上光|uv/, mode: 'sqm', price: 0.55 },
  { key: 'emboss', name: '压纹 / 击凸', re: /压纹|击凸|凹凸|压凹凸|击凹/, mode: 'sqm', price: 0.4 },
  { key: 'window', name: '开窗（贴 PET 片）', re: /开窗|开天窗|镂空/, mode: 'pc', price: 0.28 },
  { key: 'handle', name: '手提绳 / 提手', re: /手提绳|提手|拎手|手提带|手提/, mode: 'pc', price: 0.35 },
  { key: 'insert', name: '内衬 / 内托', re: /内衬|内托|内卡|隔档|内格/, mode: 'pc', price: 0.4 },
  { key: 'coating', name: '防潮 / 防水涂层', re: /防潮|防水|淋膜|涂层/, mode: 'sqm', price: 0.6 },
  { key: 'tear', name: '易撕线', re: /易撕|撕拉线|撕口/, mode: 'pc', price: 0.05 }
]

function parseCrafts(text) {
  const t = String(text || '')
  return CRAFTS.filter((c) => c.re.test(t))
}

/* ===================== 形态判定 ===================== */

const TYPE_NAME = { box: '盒 / 箱', bag: '袋类', tray: '内衬 / 内托', sheet: '平面片材' }

function parseType(text, size) {
  const t = String(text || '')
  if (/手提袋|纸袋|塑料袋|快递袋|包装袋|袋子|真空袋|气泡袋|自封袋|背心袋/.test(t)) return 'bag'
  if (/内衬|内托|内卡|托盘|隔档|内格|吸塑托/.test(t)) return 'tray'
  if (/纸箱|纸盒|彩盒|礼盒|箱|盒|罐|桶/.test(t)) return 'box'
  if (/吊牌|标签|贴纸|说明书|彩页|画册|卡片|单页|隔纸|衬纸/.test(t)) return 'sheet'
  if (size && size.h > 0) return 'box'
  return 'sheet'
}

/* ===================== 面积计算 ===================== */

const WASTE = { box: 1.12, bag: 1.04, tray: 1.08, sheet: 1.05 }

/**
 * 单只展开面积（㎡）
 * box   ：2×(长×宽 + 长×高 + 宽×高)  —— 六面体展开
 * bag   ：2×(宽×高) + 2×(侧宽×高)     —— 前后片 + 两侧风琴位（l=宽, w=高, h=侧宽）
 * tray  ：长×宽 + 2×(长×高) + 2×(宽×高) —— 只有底和四周立边，无盖
 * sheet ：长×宽                        —— 平张
 */
function calcArea(type, size) {
  const { l, w, h } = size
  let net = 0
  let formula = ''

  if (type === 'box') {
    net = (2 * (l * w + l * h + w * h)) / 1e6
    formula = `2×(长×宽 ${l}×${w} + 长×高 ${l}×${h} + 宽×高 ${w}×${h}) ÷ 10⁶`
  } else if (type === 'bag') {
    const depth = h || 0
    net = (2 * (l * w) + 2 * (depth * w)) / 1e6
    formula = depth
      ? `2×(宽×高 ${l}×${w}) + 2×(侧宽×高 ${depth}×${w}) ÷ 10⁶`
      : `2×(宽×高 ${l}×${w}) ÷ 10⁶`
  } else if (type === 'tray') {
    const wall = h || 0
    net = (l * w + 2 * (l * wall) + 2 * (w * wall)) / 1e6
    formula = `底 ${l}×${w} + 2×(长×边高 ${l}×${wall}) + 2×(宽×边高 ${w}×${wall}) ÷ 10⁶`
  } else {
    net = (l * w) / 1e6
    formula = `长×宽 ${l}×${w} ÷ 10⁶`
  }

  const waste = WASTE[type] || 1.05
  return {
    net: Math.round(net * 10000) / 10000,
    gross: Math.round(net * waste * 10000) / 10000,
    waste,
    wastePercent: Math.round((waste - 1) * 100),
    formula
  }
}

/* ===================== 数量阶梯 ===================== */

function tierOf(qty) {
  if (qty >= 20000) return { text: '≥ 20,000 只，享 12% 优惠', factor: 0.88 }
  if (qty >= 5000) return { text: '5,000 只以上，享 6% 优惠', factor: 0.94 }
  if (qty >= 2000) return { text: '2,000 – 5,000 只，标准价', factor: 1 }
  if (qty >= 500) return { text: '500 – 2,000 只，上浮 10%（小批量调机）', factor: 1.1 }
  return { text: '< 500 只，上浮 25%（以打样 / 手工为主）', factor: 1.25 }
}

/* ===================== 数字格式化 ===================== */

function fixed(n, d) {
  const v = Number(n) || 0
  return v.toFixed(d === undefined ? 2 : d)
}

function thousands(n) {
  const v = Number(n) || 0
  const parts = v.toFixed(0).split('')
  let out = ''
  for (let i = 0; i < parts.length; i++) {
    if (i > 0 && (parts.length - i) % 3 === 0) out += ','
    out += parts[i]
  }
  return out
}

function money(n) {
  const v = Math.round((Number(n) || 0) * 100) / 100
  const s = v.toFixed(2)
  const [int, dec] = s.split('.')
  const parts = int.split('')
  let out = ''
  for (let i = 0; i < parts.length; i++) {
    if (i > 0 && (parts.length - i) % 3 === 0) out += ','
    out += parts[i]
  }
  return out + '.' + dec
}

/* ===================== 核心计算 ===================== */

/**
 * @param {object} opt
 * @param {object} opt.material materials.MATERIALS 中的原始项
 * @param {object} opt.size     {l,w,h} 毫米
 * @param {number} opt.qty
 * @param {string} opt.type     box | bag | sheet
 * @param {number} opt.colors
 * @param {Array}  opt.crafts   parseCrafts 结果
 */
function calcQuote(opt) {
  const material = opt.material
  const size = opt.size
  const qty = Math.max(1, Math.round(opt.qty || 1000))
  const type = opt.type || 'box'
  const colors = opt.colors || 0
  const crafts = opt.crafts || []

  const area = calcArea(type, size)
  const areaEach = area.gross
  const isAreaPriced = material.unit === '元/㎡'

  const items = []

  /* 1. 材料费 */
  const materialCost = isAreaPriced ? areaEach * material.price : material.price
  items.push({
    label: '材料费',
    detail: isAreaPriced
      ? `${fixed(areaEach, 4)}㎡ × ¥${materials.formatPrice(material.price)}/㎡`
      : `按 ${material.unit} 计价`,
    amount: materialCost
  })

  /* 2. 印刷费 */
  let printCost = 0
  if (colors > 0) {
    printCost = Math.max(0.04, colors * areaEach * 0.36)
    items.push({
      label: '印刷费',
      detail: `${colors} 色 × ${fixed(areaEach, 4)}㎡ × ¥0.36`,
      amount: printCost
    })
  }

  /* 3. 模切 / 压痕 */
  const diePrice = type === 'box' ? 0.09 : type === 'tray' ? 0.1 : type === 'bag' ? 0.05 : 0.03
  const dieLabel = type === 'bag' || type === 'sheet' ? '裁切 / 分切' : '模切成型'
  items.push({ label: dieLabel, detail: '按件计价', amount: diePrice })

  /* 4. 成型 */
  let glueCost = 0
  if (type === 'box') glueCost = 0.07
  else if (type === 'bag') glueCost = 0.06
  if (glueCost > 0) {
    items.push({
      label: type === 'box' ? '粘盒成型' : '制袋封口',
      detail: '按件计价',
      amount: glueCost
    })
  }

  /* 5. 后道工艺（本身是内衬材料时，不再重复计「内衬」工艺费） */
  let craftCost = 0
  const craftList = crafts.filter((c) => !(type === 'tray' && c.key === 'insert'))
  craftList.forEach((c) => {
    const amt = c.mode === 'sqm' ? areaEach * c.price : c.price
    craftCost += amt
    items.push({
      label: c.name,
      detail: c.mode === 'sqm' ? `${fixed(areaEach, 4)}㎡ × ¥${c.price}/㎡` : '按件计价',
      amount: amt
    })
  })

  /* 6. 管理及损耗 */
  const subtotal = items.reduce((s, it) => s + it.amount, 0)
  const mgmtRate = 0.08
  const mgmt = subtotal * mgmtRate

  /* 7. 阶梯 */
  const tier = tierOf(qty)
  const unitRaw = (subtotal + mgmt) * tier.factor
  /* 单只报价先定稿到分（极小件到厘），后续所有金额都由定稿单价推导，
     保证「单价 × 数量 = 货值」在客户手里能对上账 */
  const unitDecimals = unitRaw < 0.1 ? 3 : 2
  const unitPrice = Math.round(unitRaw * Math.pow(10, unitDecimals)) / Math.pow(10, unitDecimals)

  /* 8. 一次性费用 */
  const mold = type === 'box' ? 420 : type === 'tray' ? 380 : type === 'bag' ? 260 : 180
  const moldLabel = type === 'bag' ? '制袋刀模' : type === 'tray' ? '模切刀模' : '刀模'
  const sample = 260
  const plate = colors > 0 ? colors * 90 : 0
  const oneTime = mold + sample + plate

  const goodsAmount = Math.round(unitPrice * qty * 100) / 100
  const total = Math.round((goodsAmount + oneTime) * 100) / 100

  const viewItems = items.map((it) => ({
    label: it.label,
    detail: it.detail,
    amount: it.amount,
    amountText: it.amount.toFixed(4)
  }))

  return {
    materialId: material.id,
    materialName: material.name,
    spec: material.spec,
    unit: material.unit,
    materialPrice: material.price,
    materialPriceText: materials.formatPrice(material.price),
    gram: material.gram || 0,
    tonPrice: material.tonPrice || 0,
    type,
    typeName: TYPE_NAME[type],
    size,
    sizeText: `${size.l}×${size.w}${size.h ? '×' + size.h : ''}mm`,
    qty,
    qtyText: thousands(qty),
    colors,
    crafts: craftList.map((c) => c.name),
    areaNet: area.net,
    areaEach,
    areaEachText: fixed(areaEach, 4),
    areaFormula: area.formula,
    wastePercent: area.wastePercent,
    totalArea: Math.round(areaEach * qty * 100) / 100,
    items: viewItems,
    subtotal: Math.round(subtotal * 10000) / 10000,
    mgmtRate,
    mgmt: Math.round(mgmt * 10000) / 10000,
    tierFactor: tier.factor,
    tierText: tier.text,
    unitPrice,
    unitDecimals,
    unitPriceText: fixed(unitPrice, unitDecimals),
    oneTime,
    oneTimeText: money(oneTime),
    oneTimeDetail: `${moldLabel} ¥${mold} + 打样 ¥${sample}` + (plate ? ` + 印版 ¥${plate}` : ''),
    goodsAmount,
    goodsAmountText: money(goodsAmount),
    total,
    totalText: money(total),
    createdAt: Date.now()
  }
}

/* ===================== 话术生成 ===================== */

function buildReply(q) {
  const lines = []

  lines.push(`按「${q.materialName}」给你算了版报价：`)

  lines.push('')
  lines.push('【工艺口径】')
  lines.push(`· 形态：${q.typeName}`)
  const dimHint =
    q.type === 'bag' ? '（宽×高×侧宽）' : q.type === 'sheet' ? '（长×宽）' : '（长×宽×高）'
  lines.push(`· 尺寸：${q.sizeText}${dimHint}`)
  lines.push(`· 单只展开面积：${q.areaEachText} ㎡（净 ${fixed(q.areaNet, 4)} ㎡，含 ${q.wastePercent}% 出血与损耗）`)
  lines.push(`· 数量：${q.qtyText} 只`)

  lines.push('')
  lines.push('【材料单价】')
  if (q.gram) {
    lines.push(`· ${q.materialPriceText} 元/㎡ ＝ ${q.gram}g/㎡ × ${q.tonPrice} 元/吨 ÷ 10⁶`)
  } else {
    lines.push(`· ${q.materialPriceText} ${q.unit}`)
  }
  lines.push(`· 单只材料费 ≈ ¥${fixed(q.items[0].amount, 4)}`)

  lines.push('')
  lines.push('【成本拆解 · 每只】')
  q.items.forEach((it) => {
    lines.push(`· ${it.label}：¥${it.amountText}　（${it.detail}）`)
  })
  lines.push(`小计 ¥${fixed(q.subtotal, 4)}，加 ${Math.round(q.mgmtRate * 100)}% 管理及损耗 → ¥${fixed(q.subtotal + q.mgmt, 4)}`)

  lines.push('')
  lines.push('【数量阶梯】')
  lines.push(`· ${q.tierText}`)

  lines.push('')
  lines.push('【报价结论】')
  lines.push(`· 单只报价：¥${q.unitPriceText}`)
  lines.push(`· ${q.qtyText} 只货值：¥${money(q.goodsAmount)}`)
  lines.push(`· 一次性费用：¥${money(q.oneTime)}（${q.oneTimeDetail}）`)
  lines.push(`· 合计：¥${q.totalText}`)

  lines.push('')
  lines.push('报价有效期 7 天，最终以打样确认和纸价波动为准。需要我按另一个数量或材质再算一版吗？')

  return lines.join('\n')
}

/* ===================== 各类意图回答 ===================== */

const GREETING = /^(你好|您好|hi|hello|嗨|在吗|哈喽|早上好|下午好|晚上好)[\s!！。.~]*$/

function greetReply() {
  return (
    '你好，我是包装报价助手。\n\n' +
    '把你的包装需求说清楚，我直接出报价：材料、尺寸、数量，有印刷和工艺也一并写上。\n\n' +
    '比如：\n' +
    '「5000 个 200×150×100mm 三层瓦楞纸箱，四色印刷」\n' +
    '「白卡纸盒 300g，120×80×40mm，2000 个，覆膜」\n\n' +
    '也可以只问单价，比如「白卡纸多少钱一平方」。'
  )
}

function helpReply() {
  return (
    '我能做三件事：\n\n' +
    '1. 报价测算 —— 说出材料 + 尺寸 + 数量，我按展开面积逐项算材料费、印刷、模切、成型、工艺，并按数量给阶梯价。\n\n' +
    '2. 材料询价 —— 只说材料名，我报当前单价（纸类精确到元/㎡，含克重与吨价换算）。\n\n' +
    '3. 知识库问答 —— 在「知识库导入」里放进去的文件，我会在回答时引用。\n\n' +
    '一句完整的需求长这样：\n' +
    '「牛皮纸袋 250×350mm，10000 个，四色印刷，覆膜」'
  )
}

function materialInfoReply(m) {
  const v = materials.view(m)
  const trendText =
    v.trend === 'up'
      ? `较上月涨 ${v.trendRate}%`
      : v.trend === 'down'
      ? `较上月跌 ${Math.abs(v.trendRate)}%`
      : '价格持平'

  const lines = []
  lines.push(`「${v.name}」当前报价：${v.priceText} ${v.unit}`)
  lines.push('')
  lines.push(`· 规格：${v.spec}`)
  if (v.gram) {
    lines.push(`· 计价：${v.formula}`)
  }
  lines.push(`· 供应：${v.supplier}　更新：${v.updated}`)
  lines.push(`· 走势：${trendText}`)
  lines.push(`· 适用：${v.note}`)
  lines.push('')
  lines.push('要出成品价，再给我尺寸和数量，例如「120×80×40mm，2000 个」。')
  return lines.join('\n')
}

function listMaterialsReply(cat) {
  const catId = cat || 'paper'
  const list = materials.MATERIALS.filter((m) => m.cat === catId).slice(0, 8)
  const lines = [`${materials.catName(catId)}在库材料 ${materials.MATERIALS.filter((m) => m.cat === catId).length} 种，常用如下：`]
  lines.push('')
  list.forEach((m) => {
    lines.push(`· ${m.name}　${materials.formatPrice(m.price)} ${m.unit}　${m.spec}`)
  })
  lines.push('')
  lines.push('说一个材料名我报详情，或者说「材料 + 尺寸 + 数量」我直接出报价。完整价目在右侧菜单「报价单汇总」里。')
  return lines.join('\n')
}

function askSizeReply(m) {
  return (
    `「${m.name}」单价 ${materials.formatPrice(m.price)} ${m.unit}。\n\n` +
    '要出成品报价，还需要两个信息：\n' +
    '1. 展开尺寸（长×宽×高，mm）\n' +
    '2. 数量\n\n' +
    '例如：「200×150×100mm，5000 个，四色印刷」。'
  )
}

function askMaterialReply(size, qty) {
  const dimText = size ? `${size.l}×${size.w}${size.h ? '×' + size.h : ''}mm` : ''
  const qtyText = qty ? `${thousands(qty)} 只` : ''
  return (
    `尺寸 ${dimText}${qtyText ? '、数量 ' + qtyText : ''} 我记下了，但还没确定材料。\n\n` +
    '纸类常用这几款：\n' +
    '· 瓦楞纸板 E 楞（三层）　2.00 元/㎡　快递箱\n' +
    '· 白卡纸 300g　　　　　　1.77 元/㎡　彩盒\n' +
    '· 牛皮纸 120g　　　　　　0.83 元/㎡　纸袋\n\n' +
    '告诉我要哪种，我立刻出价。'
  )
}

function fallbackReply(raw) {
  return (
    `「${String(raw).slice(0, 24)}」这句我还没理解到位。\n\n` +
    '你可以这样问：\n' +
    '· 报价：「200×150×100mm 三层瓦楞，5000 个」\n' +
    '· 询价：「白卡纸 300g 多少钱一平」\n' +
    '· 查材料：「有哪些纸类材料」\n\n' +
    '也可以直接点下面的常用问题。'
  )
}

/* ===================== 统一入口 ===================== */

/**
 * @param {string} input 用户输入
 * @returns {{text:string, quote:object|null, material:object|null}}
 */
function answer(input) {
  const raw = String(input == null ? '' : input).trim()
  const t = normalize(raw)

  if (!t) return { text: '说点什么吧，比如「5000 个 200×150×100mm 纸箱报价」。', quote: null }

  if (/怎么用|帮助|能做什么|你会什么|使用说明|help/.test(t)) {
    return { text: helpReply(), quote: null }
  }

  const size = parseSize(raw) || parseSize(t)
  const qty = parseQty(raw) || parseQty(t)
  const material = materials.matchByText(t) || materials.matchByText(raw)

  if (GREETING.test(t) && !material && !size) {
    return { text: greetReply(), quote: null }
  }

  /* 报价：有材料 + 有尺寸 / 数量 */
  if (material && (size || qty)) {
    if (!size) {
      return { text: askSizeReply(material), quote: null }
    }
    const type = parseType(t, size)
    const colors = parseColors(t)
    const crafts = parseCrafts(t)
    const q = calcQuote({ material, size, qty: qty || 1000, type, colors, crafts })
    let text = buildReply(q)
    if (!qty) {
      text = '没看到数量，我先按 1,000 只估算，你补个真实数量我再重算。\n\n' + text
    }
    return { text, quote: q, material: materials.view(material) }
  }

  /* 询价：只有材料 */
  if (material) {
    return { text: materialInfoReply(material), quote: null, material: materials.view(material) }
  }

  /* 只有尺寸数量，缺材料 */
  if (size || qty) {
    return { text: askMaterialReply(size, qty), quote: null }
  }

  /* 类目盘点 */
  if (/有哪些|什么材料|材料清单|支持.*材料|价目|多少钱一平|单价表/.test(t)) {
    let cat = 'paper'
    if (/塑料|pe|pet|珍珠棉/.test(t)) cat = 'plastic'
    else if (/金属|马口铁|铝箔/.test(t)) cat = 'metal'
    else if (/缓冲|泡沫|气柱/.test(t)) cat = 'cushion'
    else if (/辅料|胶带|打包带/.test(t)) cat = 'aux'
    return { text: listMaterialsReply(cat), quote: null }
  }

  return { text: fallbackReply(raw), quote: null }
}

module.exports = {
  normalize,
  parseSize,
  parseQty,
  parseColors,
  parseCrafts,
  parseType,
  calcArea,
  calcQuote,
  buildReply,
  tierOf,
  CRAFTS,
  answer,
  money,
  fixed,
  thousands
}
