/**
 * 场景推荐引擎
 * ------------------------------------------------------------------
 * 职责：把「我要做汉堡的包装」这类模糊需求，翻译成可报价的工程语言：
 *   品类场景 → 结构方案 → 材料候选 → 工艺 → 合规要求 → 三档报价
 * 报价数字全部由 quote-engine 实算，本模块只负责"选什么"和"为什么"。
 * ------------------------------------------------------------------
 */
const materials = require('./materials.js')
const engine = require('./quote-engine.js')

const CRAFTS = engine.CRAFTS
const craft = (key) => CRAFTS.filter((c) => c.key === key)

const TIERS = [
  { id: 'economy', name: '经济型', desc: '控成本、走量' },
  { id: 'standard', name: '标准型', desc: '性价比首选' },
  { id: 'premium', name: '高端型', desc: '质感与品牌感' }
]

/* ===================== 品类场景库 ===================== */
const SCENES = [
  {
    id: 'burger',
    name: '汉堡包装',
    category: '餐饮外卖',
    keywords: ['汉堡', 'burger', '堡', '牛肉堡', '鸡腿堡', '汉堡盒', '汉堡纸'],
    summary: '直接接触油炸/多汁食品，核心是防油、防渗漏和短时保温',
    primary: {
      name: '汉堡折叠盒',
      type: 'box',
      size: { l: 130, w: 130, h: 85 },
      sizeLabel: '130×130×85mm',
      tiers: [
        {
          tier: 'economy',
          materialId: 'p_card_300',
          colors: 1,
          crafts: [],
          note: '白卡 300g 单色印刷，成本最低，适合档口/快闪'
        },
        {
          tier: 'standard',
          materialId: 'p_food_card',
          colors: 4,
          crafts: craft('film'),
          note: '食品级白卡 350g + 四色 + 覆膜，防油且印刷还原好'
        },
        {
          tier: 'premium',
          materialId: 'p_food_card',
          colors: 4,
          crafts: craft('film').concat(craft('uv')),
          note: '食品级白卡 + 覆哑膜 + 局部 UV，品牌感强'
        }
      ]
    },
    accessories: [
      {
        name: '防油纸衬垫',
        materialId: 'p_grease_40',
        type: 'sheet',
        size: { l: 250, w: 250 },
        ratio: 1,
        required: true,
        note: '汉堡直接放防油纸上再入盒，避免渗油塌底'
      },
      {
        name: '不干胶封口标签',
        materialId: 'a_label',
        ratio: 1,
        per: '张',
        required: false,
        note: '封口+品牌标识，100×80mm'
      }
    ],
    compliance: [
      '直接接触食品的内层必须符合 GB 4806.8 食品接触用纸',
      '建议水性油墨、无荧光增白剂，避免异味迁移',
      '油炸食品建议内层做防油处理（防油纸或淋膜）'
    ],
    tips: [
      '盒子高度建议比汉堡高 15–20mm，避免压变形',
      '外送场景建议加一层瓦楞外箱或手提纸袋，防止挤压',
      '5,000 只起做刀模划算，低于 2,000 只建议用公模盒型'
    ]
  },

  {
    id: 'fried',
    name: '炸鸡 / 小食包装',
    category: '餐饮外卖',
    keywords: ['炸鸡', '鸡块', '鸡排', '小食', '炸物', '薯条', '鸡米花', '炸串'],
    summary: '高温油炸、带油带渣，重点是防油防渗漏、透气防回软',
    primary: {
      name: '炸鸡桶 / 薯条盒',
      type: 'box',
      size: { l: 110, w: 90, h: 145 },
      sizeLabel: '110×90×145mm',
      tiers: [
        { tier: 'economy', materialId: 'p_kraft_card_200', colors: 1, crafts: [], note: '牛卡 200g 单色，本色质感、成本可控' },
        { tier: 'standard', materialId: 'p_pe_coated_220', colors: 4, crafts: craft('coating'), note: 'PE 淋膜 220g，防渗漏、可热封' },
        { tier: 'premium', materialId: 'p_pe_coated_220', colors: 4, crafts: craft('coating').concat(craft('uv')), note: '淋膜 + 四色 + 局部 UV' }
      ]
    },
    accessories: [
      { name: '防油纸衬垫', materialId: 'p_grease_40', type: 'sheet', size: { l: 240, w: 240 }, ratio: 1, required: true, note: '吸油并防止底部渗油' }
    ],
    compliance: ['内层需食品级淋膜或垫防油纸', '印刷油墨建议水性、耐温 120℃ 以上'],
    tips: ['薯条盒建议顶部开口散热，避免水汽回软', '桶身可做压纹提升挺度，减薄克重也能立得住']
  },

  {
    id: 'drink',
    name: '饮品 / 杯托包装',
    category: '餐饮外卖',
    keywords: ['奶茶', '咖啡', '饮品', '杯托', '饮料', '可乐', '杯子', '外卖杯'],
    summary: '外送防洒漏，杯托要承重防倾倒，多杯场景用模塑托',
    primary: {
      name: '纸浆模塑杯托（4 格）',
      type: 'tray',
      size: { l: 220, w: 220, h: 60 },
      sizeLabel: '220×220×60mm',
      tiers: [
        { tier: 'economy', materialId: 'c_pulp_tray', colors: 0, crafts: [], note: '甘蔗浆模塑托，可降解、单价低' },
        { tier: 'standard', materialId: 'c_pulp_tray', colors: 0, crafts: craft('coating'), note: '模塑托 + 防潮涂层，外送防软塌' },
        { tier: 'premium', materialId: 'p_cor_bc', colors: 2, crafts: craft('film'), note: '瓦楞 BC 楞组合托，可印刷品牌' }
      ]
    },
    accessories: [
      { name: '防油纸垫', materialId: 'p_grease_40', type: 'sheet', size: { l: 200, w: 200 }, ratio: 1, required: false, note: '托底吸冷凝水' }
    ],
    compliance: ['杯托需承重 4×700ml 不变形', '直接接触杯口的部分需食品级'],
    tips: ['2 杯用双格托、4 杯用四格托，比通用托省 20% 成本', '外送超过 15 分钟建议配瓦楞外箱']
  },

  {
    id: 'cake',
    name: '蛋糕 / 烘焙包装',
    category: '烘焙甜品',
    keywords: ['蛋糕', '烘焙', '甜品', '慕斯', '面包', '饼干', '点心'],
    summary: '展示性强，需要挺度和开窗，内托防移位',
    primary: {
      name: '蛋糕盒',
      type: 'box',
      size: { l: 260, w: 260, h: 140 },
      sizeLabel: '260×260×140mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_300', colors: 2, crafts: [], note: '白卡 300g 双色，基础款' },
        { tier: 'standard', materialId: 'p_card_350', colors: 4, crafts: craft('window'), note: '白卡 350g + 开窗贴 PET，展示产品' },
        { tier: 'premium', materialId: 'p_grey_15', colors: 4, crafts: craft('film').concat(craft('hot')), note: '灰板裱铜版 + 烫金，礼盒级质感' }
      ]
    },
    accessories: [
      { name: '纸浆模塑内托', materialId: 'c_paper_pulp', ratio: 1, per: '件', required: false, note: '固定蛋糕位置，防运输移位' }
    ],
    compliance: ['接触面需食品级或加垫纸', '开窗 PET 片需符合食品接触材料要求'],
    tips: ['6 寸以下用 200×200×120mm 更省料', '礼盒场景建议配手提绳，成本 +0.35 元/只']
  },

  {
    id: 'express',
    name: '快递 / 电商箱',
    category: '物流运输',
    keywords: ['快递箱', '电商箱', '纸箱', '物流', '运输箱', '发货箱', '外箱'],
    summary: '保护性优先，按内��物重量选楞型，成本敏感',
    primary: {
      name: '瓦楞纸箱',
      type: 'box',
      size: { l: 300, w: 200, h: 150 },
      sizeLabel: '300×200×150mm',
      tiers: [
        { tier: 'economy', materialId: 'p_cor_e', colors: 0, crafts: [], note: 'E 楞三层，适合 3kg 以内' },
        { tier: 'standard', materialId: 'p_cor_a', colors: 1, crafts: [], note: 'A 楞三层，缓冲更好，适合 5–10kg' },
        { tier: 'premium', materialId: 'p_cor_bc', colors: 2, crafts: craft('coating'), note: 'BC 楞五层 + 防潮，重物/长途' }
      ]
    },
    accessories: [
      { name: 'BOPP 封箱胶带', materialId: 'a_tape', ratio: 0.004, per: '卷', required: true, note: '约 250 箱/卷' }
    ],
    compliance: ['重货需标注堆码层数与防潮标识'],
    tips: ['内装物 3kg 以内选 E 楞最省钱', '需要印刷 logo 时 1 色比 4 色省约 0.15 元/只']
  },

  {
    id: 'cosmetic',
    name: '化妆品 / 个护彩盒',
    category: '日化美妆',
    keywords: ['化妆品', '彩盒', '面膜', '护肤品', '香水', '个护', '洗发水'],
    summary: '货架展示与开箱体验，工艺溢价空间大',
    primary: {
      name: '化妆品彩盒',
      type: 'box',
      size: { l: 90, w: 90, h: 160 },
      sizeLabel: '90×90×160mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_300', colors: 4, crafts: craft('film'), note: '白卡 300g 四色覆膜' },
        { tier: 'standard', materialId: 'p_card_350', colors: 4, crafts: craft('film').concat(craft('hot')), note: '白卡 350g + 烫金 logo' },
        { tier: 'premium', materialId: 'p_grey_25', colors: 4, crafts: craft('film').concat(craft('hot'), craft('emboss')), note: '灰板裱纸 + 烫金 + 击凸' }
      ]
    },
    accessories: [
      { name: 'EPE 珍珠棉内衬', materialId: 's_epe_10', type: 'tray', size: { l: 90, w: 90, h: 10 }, ratio: 1, required: false, note: '防瓶身碰撞' }
    ],
    compliance: ['彩盒标注需符合化妆品标签管理办法'],
    tips: ['烫金版费一次性，量大才摊薄', '小批量可考虑数码印刷免版费']
  },

  {
    id: 'electronics',
    name: '3C 电子包装',
    category: '电子电器',
    keywords: ['电子产品', '3c', '手机', '耳机', '充电器', '数码', '配件盒'],
    summary: '防震防刮，内托是成本大头，外观偏简约',
    primary: {
      name: '电子产品盒',
      type: 'box',
      size: { l: 180, w: 120, h: 60 },
      sizeLabel: '180×120×60mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_300', colors: 1, crafts: [], note: '白卡 300g 单色 + 纸托' },
        { tier: 'standard', materialId: 'p_card_350', colors: 4, crafts: craft('film'), note: '白卡 350g 四色覆膜' },
        { tier: 'premium', materialId: 'p_grey_15', colors: 4, crafts: craft('film').concat(craft('emboss')), note: '灰板裱纸 + 击凸，礼盒感' }
      ]
    },
    accessories: [
      { name: '纸浆模塑内托', materialId: 'c_paper_pulp', ratio: 1, per: '件', required: true, note: '缓冲定位，替代 EPE 更环保' },
      { name: 'EPE 珍珠棉护角', materialId: 'c_epe_angle', ratio: 0.2, per: '米', required: false, note: '四角防护约 0.8 米/箱' }
    ],
    compliance: ['跌落测试 1m/6 面', '防静电场景需加防静电涂层'],
    tips: ['纸浆托比 EPE 便宜且可降解，量产后开模费约 3,000 元']
  },

  {
    id: 'gift',
    name: '礼品 / 礼盒包装',
    category: '礼品文创',
    keywords: ['礼品', '礼盒', '伴手礼', '文创', '年礼', '中秋', '春节'],
    summary: '开箱仪式感，材质与工艺决定档次，季节性大单',
    primary: {
      name: '天地盖礼盒',
      type: 'box',
      size: { l: 300, w: 240, h: 80 },
      sizeLabel: '300×240×80mm',
      tiers: [
        { tier: 'economy', materialId: 'p_card_350', colors: 4, crafts: craft('film'), note: '白卡 350g 四色覆膜' },
        { tier: 'standard', materialId: 'p_grey_15', colors: 4, crafts: craft('film').concat(craft('hot')), note: '灰板 1.5mm 裱铜版 + 烫金' },
        { tier: 'premium', materialId: 'p_grey_25', colors: 4, crafts: craft('film').concat(craft('hot'), craft('emboss')), note: '灰板 2.5mm + 烫金 + 击凸' }
      ]
    },
    accessories: [
      { name: '手提绳', materialId: 'a_label', ratio: 0, per: '套', required: false, note: '手提绳约 0.35 元/只（工艺项已计）', skipCost: true }
    ],
    compliance: ['食品类礼盒内层仍需食品级接触材料'],
    tips: ['灰板裱纸工费高于白卡折叠盒约 40%', '年礼订单建议提前 45 天下单，旺季纸价上浮']
  }
]

/* ===================== 场景识别 ===================== */
function detect(text) {
  const t = String(text || '').toLowerCase()
  let best = null
  let bestScore = 0
  SCENES.forEach((s) => {
    let score = 0
    s.keywords.forEach((k) => {
      if (t.indexOf(String(k).toLowerCase()) > -1) score += k.length >= 3 ? 2 : 1
    })
    if (score > bestScore) {
      bestScore = score
      best = s
    }
  })
  return bestScore > 0 ? { scene: best, score: bestScore } : null
}

/* ===================== 配件计价 ===================== */
function priceAccessory(acc, qty) {
  const m = materials.getById(acc.materialId)
  if (!m) return null
  const count = Math.max(1, Math.round(qty * (acc.ratio == null ? 1 : acc.ratio)))

  if (acc.skipCost) {
    return {
      name: acc.name,
      materialId: m.id,
      materialName: m.name,
      spec: m.spec,
      unit: m.unit,
      unitPrice: 0,
      unitPriceText: '0',
      qty: count,
      subtotal: 0,
      subtotalText: '0.00',
      note: acc.note,
      required: !!acc.required,
      basis: '工艺项已计入主包装'
    }
  }

  let unitPrice = m.price
  let basis = `按 ${m.unit} 计价`

  if (acc.type && m.unit === '元/㎡') {
    const area = engine.calcArea(acc.type, acc.size || { l: 0, w: 0, h: 0 })
    unitPrice = area.gross * m.price
    basis = `${engine.fixed(area.gross, 4)}㎡ × ¥${materials.formatPrice(m.price)}/㎡`
  }

  const subtotal = unitPrice * count
  return {
    name: acc.name,
    materialId: m.id,
    materialName: m.name,
    spec: m.spec,
    unit: m.unit,
    unitPrice,
    unitPriceText: engine.fixed(unitPrice, 4),
    qty: count,
    subtotal,
    subtotalText: engine.money(subtotal),
    note: acc.note,
    required: !!acc.required,
    basis
  }
}

/* ===================== 方案构建 ===================== */
/**
 * @param {Object} scene  场景对象
 * @param {Number} qty    数量
 * @param {Object} sizeOverride  用户指定尺寸 {l,w,h}
 */
function buildPlans(scene, qty, sizeOverride) {
  const q = Math.max(1, Math.round(qty || 2000))
  const size = sizeOverride || scene.primary.size

  const plans = scene.primary.tiers
    .map((t) => {
      const m = materials.getById(t.materialId)
      if (!m) return null
      const quote = engine.calcQuote({
        material: m,
        size,
        qty: q,
        type: scene.primary.type,
        colors: t.colors,
        crafts: t.crafts || []
      })
      return {
        tier: t.tier,
        tierName: TIERS.filter((x) => x.id === t.tier)[0].name,
        tierDesc: TIERS.filter((x) => x.id === t.tier)[0].desc,
        materialId: m.id,
        materialName: m.name,
        materialSpec: m.spec,
        colors: t.colors,
        craftNames: (t.crafts || []).map((c) => c.name),
        unitPrice: quote.unitPrice,
        unitPriceText: quote.unitPriceText,
        goodsAmount: quote.goodsAmount,
        goodsAmountText: quote.goodsAmountText,
        oneTime: quote.oneTime,
        oneTimeText: quote.oneTimeText,
        total: quote.total,
        totalText: quote.totalText,
        areaEachText: quote.areaEachText,
        tierText: quote.tierText,
        items: quote.items,
        note: t.note,
        quote
      }
    })
    .filter(Boolean)

  const accessories = (scene.accessories || [])
    .map((a) => priceAccessory(a, q))
    .filter(Boolean)

  const accTotal = accessories.reduce((s, a) => s + a.subtotal, 0)

  plans.forEach((p) => {
    p.grandTotal = Math.round((p.total + accTotal) * 100) / 100
    p.grandTotalText = engine.money(p.grandTotal)
    p.unitWithAcc = Math.round(((p.total + accTotal) / q) * 10000) / 10000
  })

  return {
    sceneId: scene.id,
    sceneName: scene.name,
    category: scene.category,
    summary: scene.summary,
    primaryName: scene.primary.name,
    type: scene.primary.type,
    typeName: engine.TYPE_NAME ? engine.TYPE_NAME[scene.primary.type] : scene.primary.type,
    size,
    sizeText: `${size.l}×${size.w}×${size.h}mm`,
    qty: q,
    qtyText: engine.thousands(q),
    plans,
    accessories,
    accessoriesTotal: Math.round(accTotal * 100) / 100,
    accessoriesTotalText: engine.money(accTotal),
    compliance: scene.compliance || [],
    tips: scene.tips || []
  }
}

/* ===================== 本地文案（无大模型时的完整回答） ===================== */
function buildText(rec) {
  const L = []
  L.push(`按「${rec.sceneName}」给你配了三档方案，${rec.summary}。`)
  L.push('')
  L.push(`【方案概览】${rec.primaryName} · ${rec.sizeText} · ${rec.qtyText} 只`)
  L.push('')
  L.push('| 方案 | 材料 | 工艺 | 单只 | 总价 |')
  L.push('| --- | --- | --- | --- | --- |')
  rec.plans.forEach((p) => {
    const craftTxt = p.craftNames.length ? p.craftNames.join('+') : '无'
    L.push(
      `| ${p.tierName} | ${p.materialName} | ${craftTxt} | ¥${p.unitPriceText} | ¥${p.grandTotalText} |`
    )
  })
  L.push('')

  const std = rec.plans.filter((p) => p.tier === 'standard')[0] || rec.plans[0]
  L.push(`【推荐：${std.tierName}】${std.note}`)
  L.push(`· 材料：${std.materialName}（${std.materialSpec}）`)
  L.push(`· 单只展开面积：${std.areaEachText} ㎡`)
  L.push(`· 单只报价：¥${std.unitPriceText}　${rec.qtyText} 只货值 ¥${std.goodsAmountText}`)
  L.push(`· 一次性费用：¥${std.oneTimeText}（刀模 / 打样 / 印版）`)
  L.push(`· 合计（含配件）：¥${std.grandTotalText}`)
  L.push('')
  L.push('【成本拆解 · 每只】')
  std.items.forEach((it) => {
    L.push(`· ${it.label}：¥${it.amountText}　（${it.detail}）`)
  })
  if (rec.accessories.length) {
    L.push('')
    L.push(`【配件】小计 ¥${rec.accessoriesTotalText}`)
    rec.accessories.forEach((a) => {
      L.push(`· ${a.name}：${a.materialName} × ${engine.thousands(a.qty)}　¥${a.subtotalText}（${a.basis}）`)
    })
  }
  if (rec.compliance.length) {
    L.push('')
    L.push('【合规与工艺要求】')
    rec.compliance.forEach((c) => L.push(`· ${c}`))
  }
  if (rec.tips.length) {
    L.push('')
    L.push('【选型建议】')
    rec.tips.forEach((t) => L.push(`· ${t}`))
  }
  L.push('')
  L.push('报价有效期 7 天，最终以打样确认和纸价波动为准。要换数量、尺寸或改用别的材料，直接说。')
  return L.join('\n')
}

/* ===================== 对外 ===================== */
function catalog() {
  return SCENES.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    summary: s.summary,
    size: s.primary.size,
    keywords: s.keywords.slice(0, 4)
  }))
}

/**
 * 主入口：一句话 → 推荐结果
 * @param {String} text  用户输入
 * @param {Number} qtyOverride
 */
function recommend(text, qtyOverride) {
  const hit = detect(text)
  if (!hit) return null
  const qty = qtyOverride || engine.parseQty(text) || 2000
  const size = engine.parseSize(text)
  const rec = buildPlans(hit.scene, qty, size)
  rec.matchedScore = hit.score
  rec.text = buildText(rec)
  return rec
}

module.exports = { SCENES, TIERS, catalog, detect, recommend, buildPlans, buildText }
