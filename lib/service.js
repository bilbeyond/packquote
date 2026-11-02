/**
 * 业务服务层
 * ------------------------------------------------------------------
 * 服务端（Node + server.js）与静态版（GitHub Pages，浏览器内运行）
 * 共用同一份业务逻辑：报价、场景推荐、知识库、价目表、报价单。
 * 差异只在存储后端与流式输出方式，由各自的调用方注入。
 */
function createService(deps) {
  const engine = deps.engine
  const materials = deps.materials
  const recommend = deps.recommend
  const pricelist = deps.pricelist
  const store = deps.store
  const kb = deps.kb
  const llm = deps.llm

  /* ---------------- 工具 ---------------- */
  function toBytes(body) {
    if (body && body.buffer && body.buffer.length) return body.buffer
    const b64 = body && body.base64 ? String(body.base64) : ''
    if (!b64) throw new Error('文件内容为空')
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64')
    const bin = atob(b64)
    const u8 = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
    return u8
  }

  function csvCell(v) {
    const s = String(v == null ? '' : v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }

  /* ---------------- 状态 / 配置 ---------------- */
  function state() {
    return {
      config: store.getConfig(),
      scenes: recommend.catalog(),
      stats: Object.assign(kb.stats(), {
        quotes: store.getQuotes().length,
        materials: pricelist.viewAll().length
      })
    }
  }

  /* ---------------- 对话 ---------------- */
  /**
   * @param {object} opts { text, history, useLLM }
   * @param {function} emit (type, payload) => void
   */
  async function chat(opts, emit) {
    const text = String((opts && opts.text) || '').trim()
    const history = (opts && Array.isArray(opts.history) && opts.history) || []
    const useLLM = !opts || opts.useLLM !== false

    const rec = recommend.recommend(text)
    const kbHits = kb.search(text, 3)

    let direct = null
    let directQuote = null
    if (!rec) {
      const r = engine.answer(text)
      direct = r.text
      directQuote = r.quote || null
    }

    const cfg = store.getConfig(true)
    const llmOn = useLLM && llm.ready()

    emit('meta', {
      scene: rec ? { id: rec.sceneId, name: rec.sceneName, category: rec.category } : null,
      rec: rec || null,
      direct: direct,
      directQuote: directQuote,
      kbHits: kbHits,
      llm: { enabled: llmOn, model: cfg.llm.model, baseUrl: cfg.llm.baseUrl }
    })

    const localText = rec ? rec.text : direct
    let usedLLM = false

    if (llmOn) {
      try {
        const ctx = llm.buildContext(rec, kbHits, rec ? null : direct)
        const messages = llm.buildMessages(text, ctx, history)
        let n = 0
        for await (const delta of llm.stream({ messages })) {
          n += delta.length
          emit('delta', delta)
        }
        if (n === 0) throw new Error('模型返回空内容')
        usedLLM = true
        emit('done', { usedLLM: true })
        return
      } catch (e) {
        emit('notice', { level: 'warn', message: '大模型调用失败，已切换本地引擎：' + e.message })
      }
    }

    const step = Math.max(14, Math.ceil(localText.length / 90))
    for (let i = 0; i < localText.length; i += step) {
      emit('delta', localText.slice(i, i + step))
      await new Promise((r) => setTimeout(r, 16))
    }
    emit('done', {
      usedLLM,
      notice: llmOn
        ? null
        : !cfg.llm.enabled
        ? '未启用大模型，当前由本地报价引擎回答'
        : '未配置 API Key，当前由本地报价引擎回答'
    })
  }

  /* ---------------- 价目表 ---------------- */
  const materialsApi = {
    list: () => ({ list: pricelist.viewAll(), cats: materials.CATEGORIES, subs: materials.PAPER_SUBS }),
    upsert: (obj) => {
      try {
        return { ok: true, item: materials.view(pricelist.upsert(obj)) }
      } catch (e) {
        return { ok: false, message: e.message }
      }
    },
    remove: (id) => ({ ok: pricelist.remove(id) }),
    reset: () => ({ ok: pricelist.reset() }),
    exportCsv: () => '﻿' + pricelist.toCsv(),
    importCsv: (csv) => {
      try {
        return { ok: true, result: pricelist.importCsv(csv || '') }
      } catch (e) {
        return { ok: false, message: e.message }
      }
    }
  }

  /* ---------------- 报价单 ---------------- */
  const quotesApi = {
    list: () => ({ list: store.getQuotes() }),
    add: (q) => ({ ok: true, item: store.addQuote(q) }),
    remove: (id) => {
      store.removeQuote(id)
      return { ok: true }
    },
    exportCsv: () => {
      const list = store.getQuotes()
      const head = ['保存时间', '场景/需求', '主包装', '材料', '尺寸', '数量', '单只报价', '货值', '一次性费用', '合计']
      const rows = [head.join(',')]
      list.forEach((q) => {
        rows.push(
          [
            q.createdText || '',
            q.sceneName || q.title || '',
            q.primaryName || '',
            q.materialName || '',
            q.sizeText || '',
            q.qty || '',
            q.unitPriceText || '',
            q.goodsAmountText || '',
            q.oneTimeText || '',
            q.totalText || q.grandTotalText || ''
          ]
            .map(csvCell)
            .join(',')
        )
      })
      return '﻿' + rows.join('\n')
    }
  }

  /* ---------------- 知识库 ---------------- */
  const kbApi = {
    list: () => ({ list: kb.list(), stats: kb.stats() }),
    upload: (body) => {
      try {
        const buf = toBytes(body)
        const entry = kb.add({ name: body.name || '未命名文件', buffer: buf })
        return { ok: true, item: entry, stats: kb.stats() }
      } catch (e) {
        return { ok: false, message: e.message }
      }
    },
    remove: (id) => {
      kb.remove(id)
      return { ok: true, stats: kb.stats() }
    },
    content: (id) => ({ id, content: kb.content(id) })
  }

  return {
    state,
    chat,
    getConfig: () => store.getConfig(),
    setConfig: (patch) => store.setConfig(patch),
    testLLM: () => llm.test(),
    materials: materialsApi,
    quotes: quotesApi,
    kb: kbApi,
    scenes: () => ({ list: recommend.catalog() })
  }
}

/* eslint-disable no-undef */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createService }
}
