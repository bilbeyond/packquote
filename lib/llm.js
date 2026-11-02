/**
 * 大模型接入（OpenAI 兼容协议）
 * ------------------------------------------------------------------
 * DeepSeek / 通义千问 / Kimi / 智谱 / OpenAI / 本地 Ollama 等
 * 只要提供 baseUrl（含 /v1）+ apiKey + 模型名即可接入。
 *
 * 关键约束：模型只负责"理解意图 + 解释推荐理由 + 组织话术"，
 * 所有价格、面积、报价数字都由本地引擎算好后作为事实材料注入，
 * 通过 system prompt 明确禁止模型自行编造价格。
 * ------------------------------------------------------------------
 */
const store = require('./store.js')

function endpoint(baseUrl) {
  let base = String(baseUrl || '').trim().replace(/\/+$/, '')
  if (!base) base = 'https://api.deepseek.com/v1'
  if (/\/chat\/completions$/.test(base)) return base
  return base + '/chat/completions'
}

function ready() {
  const c = store.getConfig(true)
  return !!(c.llm && c.llm.enabled && c.llm.apiKey && c.llm.baseUrl && c.llm.model)
}

const SYSTEM = `你是「包装材料报价智能体」，服务包装采购与包装设计人员。

【铁律】
1. 报价数字只能来自系统提供的【报价事实数据】，禁止自行计算、估算或编造任何价格、面积、克重。
2. 若事实数据里没有用户要的材料或规格，直接说明"价目库暂缺，建议按以下参数询价"，不要给数字。
3. 回答用中文，结构化：先给结论（推荐哪个方案、为什么），再给关键数字，最后给落地建议。
4. 涉及食品接触、运输安全、印刷工艺等要求时，必须提示合规点。
5. 语气专业、直接，不写客套话，不重复用户问题。

【输出格式】
- 用 Markdown，可用表格做方案对比
- 关键数字加粗，金额保留 2 位小数并带 ¥
- 结尾最多一句追问，不要罗列多个问题`

/* 把本地计算结果打包成模型可用的事实材料 */
function buildContext(rec, kbHits, direct) {
  const parts = []
  if (rec) {
    parts.push('【识别到的场景】' + rec.sceneName + '（' + rec.category + '）')
    parts.push('【主包装】' + rec.primaryName + '　尺寸 ' + rec.sizeText + '　数量 ' + rec.qtyText + ' 只')
    parts.push('【三档方案】（已按本地报价引擎实算，直接使用，不要重算）')
    rec.plans.forEach((p) => {
      parts.push(
        `- ${p.tierName}：${p.materialName}（${p.materialSpec}），工艺 ${p.craftNames.join('+') || '无'}，` +
          `单只 ¥${p.unitPriceText}，展开面积 ${p.areaEachText} ㎡，货值 ¥${p.goodsAmountText}，` +
          `一次性费用 ¥${p.oneTimeText}，含配件合计 ¥${p.grandTotalText}`
      )
      p.items.forEach((it) => parts.push(`    · ${it.label} ¥${it.amountText}（${it.detail}）`))
    })
    if (rec.accessories && rec.accessories.length) {
      parts.push('【配件】小计 ¥' + rec.accessoriesTotalText)
      rec.accessories.forEach((a) => {
        parts.push(`- ${a.name}：${a.materialName} × ${a.qty}，¥${a.subtotalText}（${a.basis}）`)
      })
    }
    if (rec.compliance && rec.compliance.length) {
      parts.push('【合规与工艺要求】\n' + rec.compliance.map((c) => '- ' + c).join('\n'))
    }
    if (rec.tips && rec.tips.length) {
      parts.push('【选型建议】\n' + rec.tips.map((t) => '- ' + t).join('\n'))
    }
  }
  if (direct) {
    parts.push('【直接报价结果】\n' + direct)
  }
  if (kbHits && kbHits.length) {
    parts.push('【知识库引用】')
    kbHits.forEach((h) => parts.push(`- 来源《${h.name}》：${h.snippet}`))
  }
  return parts.join('\n')
}

function buildMessages(userText, context, history) {
  const msgs = [{ role: 'system', content: SYSTEM }]
  ;(history || []).slice(-6).forEach((m) => {
    if (m && m.role && m.content) msgs.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })
  })
  msgs.push({
    role: 'user',
    content:
      '用户问题：' + userText + '\n\n【报价事实数据】（本地引擎实算，直接引用，禁止重算或编造）\n' + context
  })
  return msgs
}

/* ---------- 流式调用 ---------- */
async function* stream(opts) {
  const cfg = store.getConfig(true).llm
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), cfg.timeoutMs || 45000)

  let res
  try {
    res = await fetch(endpoint(cfg.baseUrl), {
      method: 'POST',
      signal: ac.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cfg.apiKey
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: opts.messages,
        temperature: cfg.temperature == null ? 0.4 : cfg.temperature,
        max_tokens: cfg.maxTokens || 1600,
        stream: true
      })
    })
  } catch (e) {
    clearTimeout(timer)
    throw new Error(ac.signal.aborted ? '模型响应超时' : '无法连接模型服务：' + e.message)
  }

  if (!res.ok || !res.body) {
    clearTimeout(timer)
    const t = await res.text().catch(() => '')
    throw new Error('模型返回 ' + res.status + '：' + t.slice(0, 200))
  }

  const decoder = new TextDecoder('utf-8')
  let buf = ''
  try {
    for await (const chunk of res.body) {
      buf += decoder.decode(chunk, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop()
      for (const line of lines) {
        const l = line.trim()
        if (!l.startsWith('data:')) continue
        const data = l.slice(5).trim()
        if (data === '[DONE]') {
          clearTimeout(timer)
          return
        }
        try {
          const json = JSON.parse(data)
          const delta = json.choices && json.choices[0] && json.choices[0].delta
          if (delta && delta.content) yield delta.content
        } catch (e) {}
      }
    }
  } finally {
    clearTimeout(timer)
  }
}

/* ---------- 非流式（连通性测试） ---------- */
async function test() {
  const cfg = store.getConfig(true).llm
  if (!cfg.apiKey) return { ok: false, message: '未填写 API Key' }
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 20000)
  try {
    const res = await fetch(endpoint(cfg.baseUrl), {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cfg.apiKey },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: 'system', content: '你是报价助手' },
          { role: 'user', content: '回复两个字：可用' }
        ],
        max_tokens: 16
      })
    })
    clearTimeout(timer)
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      return { ok: false, message: 'HTTP ' + res.status + ' ' + t.slice(0, 160) }
    }
    const j = await res.json()
    const txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content
    return { ok: true, message: '连通正常，模型回复：' + String(txt || '').slice(0, 40) }
  } catch (e) {
    clearTimeout(timer)
    return { ok: false, message: e.message }
  }
}

module.exports = { ready, stream, test, buildContext, buildMessages, SYSTEM, endpoint }
