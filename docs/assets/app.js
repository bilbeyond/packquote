/* 包装材料报价智能体 · 前端逻辑 */
(function () {
  'use strict'

  const $ = (s) => document.querySelector(s)
  const $$ = (s) => Array.prototype.slice.call(document.querySelectorAll(s))
  const state = {
    view: 'chat',
    messages: [],
    sessions: [],
    cur: -1,
    rec: null,
    selPlan: 'standard',
    cfg: null,
    scenes: [],
    mats: [],
    matCat: 'all',
    matKw: ''
  }

  /* ================= 工具 ================= */
  function toast(msg) {
    const t = $('#toast')
    t.textContent = msg
    t.classList.add('is-on')
    clearTimeout(t._t)
    t._t = setTimeout(() => t.classList.remove('is-on'), 1800)
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  function inlineMd(s) {
    let t = esc(s)
    t = t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
    return t
  }

  /* 极简 Markdown：标题 / 表格 / 列表 / 加粗 / 段落 */
  function md(src) {
    const lines = String(src || '').split('\n')
    const out = []
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      if (/^\s*\|/.test(line)) {
        const rows = []
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++])
        const cells = rows.map((r) => r.split('|').slice(1, -1).map((c) => c.trim()))
        let h = '<table>'
        cells.forEach((row, idx) => {
          if (/^[-\s:|]+$/.test(row.join(''))) return
          const tag = idx === 0 ? 'th' : 'td'
          h += '<tr>' + row.map((c) => '<' + tag + '>' + inlineMd(c) + '</' + tag + '>').join('') + '</tr>'
        })
        out.push(h + '</table>')
        continue
      }
      if (/^#{1,4}\s/.test(line)) {
        const lv = line.match(/^#+/)[0].length
        out.push('<h' + lv + '>' + inlineMd(line.replace(/^#+\s*/, '')) + '</h' + lv + '>')
        i++
        continue
      }
      if (/^\s*[-·*]\s/.test(line)) {
        const items = []
        while (i < lines.length && /^\s*[-·*]\s/.test(lines[i])) {
          items.push(inlineMd(lines[i].replace(/^\s*[-·*]\s/, '')))
          i++
        }
        out.push('<ul>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ul>')
        continue
      }
      if (/^\s*$/.test(line)) {
        i++
        continue
      }
      const buf = []
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^\s*\|/.test(lines[i]) &&
        !/^#{1,4}\s/.test(lines[i]) &&
        !/^\s*[-·*]\s/.test(lines[i])
      ) {
        buf.push(lines[i++])
      }
      out.push('<p>' + inlineMd(buf.join('<br>')) + '</p>')
    }
    return out.join('')
  }

  /* ================= API 层：服务端模式 / 静态模式 =================
   * server：node server.js 时走 /api/*
   * static：GitHub Pages 纯前端，调用浏览器内的 PQService（本地计算 + localStorage）
   */
  let MODE = 'server'
  const S = () => window.PQService

  function qs(u) {
    const i = String(u).indexOf('?')
    const out = {}
    if (i < 0) return out
    String(u)
      .slice(i + 1)
      .split('&')
      .forEach((p) => {
        const kv = p.split('=')
        out[kv[0]] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '))
      })
    return out
  }

  const LOCAL = {
    'GET /api/state': (q, b) => S().state(),
    'GET /api/config': () => S().getConfig(),
    'POST /api/config': (q, b) => S().setConfig(b),
    'POST /api/llm/test': () => S().testLLM(),
    'GET /api/materials': () => S().materials.list(),
    'POST /api/materials': (q, b) => S().materials.upsert(b),
    'DELETE /api/materials': (q) => S().materials.remove(q.id),
    'POST /api/materials/reset': () => S().materials.reset(),
    'POST /api/materials/import': (q, b) => S().materials.importCsv(b.csv || ''),
    'GET /api/quotes': () => S().quotes.list(),
    'POST /api/quotes': (q, b) => S().quotes.add(b),
    'DELETE /api/quotes': (q) => S().quotes.remove(q.id),
    'GET /api/kb': () => S().kb.list(),
    'POST /api/kb/upload': (q, b) => S().kb.upload(b),
    'DELETE /api/kb': (q) => S().kb.remove(q.id),
    'GET /api/kb/content': (q) => S().kb.content(q.id)
  }

  function runLocal(method, u, body) {
    try {
      const i = String(u).indexOf('?')
      const base = i < 0 ? u : String(u).slice(0, i)
      const fn = LOCAL[method + ' ' + base]
      if (!fn) return Promise.reject(new Error('静态版不支持该接口：' + base))
      return Promise.resolve(fn(qs(u), body))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const api = {
    get: (u) => (MODE === 'static' ? runLocal('GET', u) : fetch(u).then((r) => r.json())),
    post: (u, body) =>
      MODE === 'static'
        ? runLocal('POST', u, body)
        : fetch(u, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body || {})
          }).then((r) => r.json()),
    del: (u) => (MODE === 'static' ? runLocal('DELETE', u) : fetch(u, { method: 'DELETE' }).then((r) => r.json()))
  }

  /** CSV 导出：服务端走下载链接，静态版用 Blob */
  function downloadCsv(path, filename) {
    if (MODE === 'static') {
      const csv = path.indexOf('materials') > -1 ? S().materials.exportCsv() : S().quotes.exportCsv()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      return
    }
    window.location = path
  }

  /* ================= 视图切换 ================= */
  function setView(v) {
    state.view = v
    $$('.navbtn').forEach((b) => b.classList.toggle('is-on', b.dataset.view === v))
    $$('.view').forEach((s) => s.classList.toggle('is-on', s.id === 'view-' + v))
    if (v === 'materials') loadMaterials()
    if (v === 'kb') loadKb()
    if (v === 'quotes') loadQuotes()
    if (v === 'settings') loadConfig()
  }

  $$('.navbtn').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)))

  /* ================= 状态 / 场景 ================= */
  function loadState() {
    return api.get('/api/state').then((s) => {
      state.cfg = s.config
      state.scenes = s.scenes || []
      $('#badgeQuotes').textContent = s.stats.quotes || 0
      const on = !!(s.config.llm && s.config.llm.enabled && s.config.llm.hasKey)
      $('#toggleLLM').checked = on
      $('#modelTag').textContent = on ? '大模型 ' + (s.config.llm.model || '') : '本地引擎'
      $('#modelTag').classList.toggle('on', on)
      $('#engineDot').className = 'dot ' + (on ? 'on' : '')
      $('#engineText').textContent = on ? '大模型 + 本地引擎' : '本地报价引擎'

      $('#sceneChips').innerHTML = state.scenes
        .map((s) => '<button class="chip" data-scene="' + esc(s.name) + '">' + esc(s.name) + '</button>')
        .join('')
      $$('#sceneChips .chip').forEach((c) =>
        c.addEventListener('click', () => {
          setView('chat')
          $('#input').value = '我要做' + c.dataset.scene + '，2000 个'
          send()
        })
      )

      const asks = [
        '我要做一个汉堡的包装，5000 个',
        '炸鸡桶 3000 个，要防油',
        '300×200×150mm 快递箱 10000 个',
        '奶茶杯托 4 格，20000 个',
        '化妆品彩盒 90×90×160mm，5000 个'
      ]
      $('#askRow').innerHTML = asks.map((a) => '<button class="ask">' + esc(a) + '</button>').join('')
      $$('.ask').forEach((b) =>
        b.addEventListener('click', () => {
          $('#input').value = b.textContent
          send()
        })
      )
    })
  }

  /* ================= 对话 ================= */
  function addMsg(role, html, extra) {
    const wrap = document.createElement('div')
    wrap.className = 'msg ' + role
    const av = document.createElement('div')
    av.className = 'avatar'
    av.textContent = role === 'user' ? '我' : '包'
    const body = document.createElement('div')
    body.style.minWidth = '0'
    const bub = document.createElement('div')
    bub.className = 'bubble'
    bub.innerHTML = html
    body.appendChild(bub)
    if (extra) body.insertAdjacentHTML('beforeend', extra)
    wrap.appendChild(av)
    wrap.appendChild(body)
    $('#msgs').appendChild(wrap)
    $('#msgs').scrollTop = $('#msgs').scrollHeight
    return { wrap, bub, body }
  }

  function plansHtml(rec) {
    const plans = rec.plans || []
    return (
      '<div class="plans">' +
      plans
        .map((p) => {
          const sel = p.tier === state.selPlan ? ' is-sel' : ''
          const rec2 = p.tier === 'standard' ? ' rec' : ''
          return (
            '<div class="plan' + sel + rec2 + '" data-tier="' + p.tier + '">' +
            '<div class="plan-t">' + esc(p.tierName) + '</div>' +
            '<div class="plan-d">' + esc(p.tierDesc) + '</div>' +
            '<div class="plan-m">' + esc(p.materialName) + '<br>' + esc(p.craftNames.join(' + ') || '无工艺') + '</div>' +
            '<div class="plan-p"><span class="plan-cur">¥</span><span class="plan-num">' + esc(p.unitPriceText) + '</span><span class="plan-u">/只</span></div>' +
            '<div class="plan-total">合计 ¥' + esc(p.grandTotalText) + '</div>' +
            '</div>'
          )
        })
        .join('') +
      '</div>'
    )
  }

  function bindPlans(node) {
    $$('.plan', node).forEach((el) =>
      el.addEventListener('click', () => {
        state.selPlan = el.dataset.tier
        $$('.plan').forEach((p) => p.classList.toggle('is-sel', p.dataset.tier === state.selPlan))
        renderCtx()
      })
    )
  }

  function send() {
    const text = $('#input').value.trim()
    if (!text) return
    $('#input').value = ''
    $('#btnSend').disabled = true

    addMsg('user', '<p>' + esc(text) + '</p>')
    state.messages.push({ role: 'user', content: text })

    const m = addMsg('ai', '<span class="caret">&nbsp;</span>')
    m.bub.innerHTML = ''

    const useLLM = $('#toggleLLM').checked
    const history = state.messages.slice(-8, -1)

    let full = ''

    const handle = (ev) => {
      if (ev.type === 'meta') {
        state.rec = ev.payload.rec
        state.selPlan = 'standard'
        if (ev.payload.rec) {
          m.body.insertAdjacentHTML('beforeend', plansHtml(ev.payload.rec))
          bindPlans(m.body)
          renderCtx()
        }
        state.messages.push({ role: 'ai', content: '' })
        if (ev.payload.kbHits && ev.payload.kbHits.length) {
          m.body.insertAdjacentHTML(
            'beforeend',
            '<div class="srcref">知识库引用：' +
              ev.payload.kbHits.map((h) => esc(h.name)).join('、') +
              '</div>'
          )
        }
      } else if (ev.type === 'delta') {
        full += ev.payload
        m.bub.innerHTML = md(full) + '<span class="caret">&nbsp;</span>'
        $('#msgs').scrollTop = $('#msgs').scrollHeight
      } else if (ev.type === 'notice') {
        m.body.insertAdjacentHTML('beforeend', '<div class="notice">' + esc(ev.payload.message) + '</div>')
      } else if (ev.type === 'done') {
        full = full || ''
      }
    }

    const finish = () => {
      m.bub.innerHTML = md(full)
      if (state.rec) {
        m.body.insertAdjacentHTML(
          'beforeend',
          '<div class="msgfoot"><button class="mini" data-act="copy">复制文本</button>' +
            '<button class="mini primary" data-act="save">存入报价单</button></div>'
        )
        const copyBtn = m.body.querySelector('[data-act="copy"]')
        const saveBtn = m.body.querySelector('[data-act="save"]')
        if (copyBtn)
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(full).then(() => toast('已复制'))
          })
        if (saveBtn)
          saveBtn.addEventListener('click', () => {
            saveQuote(full)
          })
      }
      state.messages[state.messages.length - 1].content = full
      $('#btnSend').disabled = false
      $('#msgs').scrollTop = $('#msgs').scrollHeight
      saveSession()
    }

    const fail = (e) => {
      m.bub.innerHTML = '<p>请求失败：' + esc(e.message) + '</p>'
      $('#btnSend').disabled = false
    }

    /* 静态版：全部在浏览器内计算，不走网络 */
    if (MODE === 'static') {
      S()
        .chat({ text, history, useLLM }, (type, payload) => handle({ type, payload }))
        .then(finish)
        .catch(fail)
      return
    }

    /* 服务端版：SSE 流式读取 */
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, history, useLLM })
    })
      .then((res) => {
        const reader = res.body.getReader()
        const dec = new TextDecoder('utf-8')
        let buf = ''

        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) return finish()
            buf += dec.decode(value, { stream: true })
            const lines = buf.split('\n')
            buf = lines.pop()
            lines.forEach((l) => {
              l = l.trim()
              if (!l.startsWith('data:')) return
              const d = l.slice(5).trim()
              if (!d) return
              let ev
              try {
                ev = JSON.parse(d)
              } catch (e) {
                return
              }
              handle(ev)
            })
            return pump()
          })
        }

        return pump()
      })
      .catch(fail)
  }

  function saveQuote(text) {
    const rec = state.rec
    if (!rec) return
    const p = rec.plans.filter((x) => x.tier === state.selPlan)[0] || rec.plans[0]
    api
      .post('/api/quotes', {
        sceneName: rec.sceneName,
        primaryName: rec.primaryName,
        materialName: p.materialName,
        sizeText: rec.sizeText,
        qty: rec.qty,
        qtyText: rec.qtyText,
        unitPriceText: p.unitPriceText,
        goodsAmountText: p.goodsAmountText,
        oneTimeText: p.oneTimeText,
        totalText: p.grandTotalText,
        tierText: p.tierText,
        areaText: p.areaEachText,
        craftText: p.craftNames.join(' + '),
        note: text.slice(0, 200),
        createdText: new Date().toLocaleString('zh-CN', { hour12: false })
      })
      .then(() => {
        toast('已存入报价单')
        $('#badgeQuotes').textContent = Number($('#badgeQuotes').textContent) + 1
      })
  }

  $('#btnSend').addEventListener('click', send)
  $('#input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  })
  $('#input').addEventListener('input', () => {
    const el = $('#input')
    el.style.height = 'auto'
    el.style.height = Math.min(132, el.scrollHeight) + 'px'
  })

  /* ================= 右侧上下文 ================= */
  function renderCtx() {
    const rec = state.rec
    const box = $('#ctxBody')
    if (!rec) return
    const p = rec.plans.filter((x) => x.tier === state.selPlan)[0] || rec.plans[0]
    $('#ctxScene').textContent = rec.sceneName

    const items = (p.items || [])
      .map(
        (it) =>
          '<div class="cost-item"><span>' + esc(it.label) +
          '<span class="cd"> ' + esc(it.detail) + '</span></span><span>¥' + esc(it.amountText) + '</span></div>'
      )
      .join('')

    const acc = (rec.accessories || [])
      .map(
        (a) =>
          '<div class="cost-item"><span>' + esc(a.name) + '<span class="cd"> ×' + esc(a.qty) + '</span></span><span>¥' +
          esc(a.subtotalText) + '</span></div>'
      )
      .join('')

    box.innerHTML =
      '<div class="ctx-sec"><div class="ctx-sec-t">需求</div>' +
      '<div class="kv"><span class="k">主包装</span><span class="v">' + esc(rec.primaryName) + '</span></div>' +
      '<div class="kv"><span class="k">尺寸</span><span class="v">' + esc(rec.sizeText) + '</span></div>' +
      '<div class="kv"><span class="k">数量</span><span class="v">' + esc(rec.qtyText) + ' 只</span></div>' +
      '<div class="kv"><span class="k">展开面积</span><span class="v">' + esc(p.areaEachText) + ' ㎡</span></div>' +
      '</div>' +

      '<div class="ctx-sec"><div class="ctx-sec-t">推荐材料 · ' + esc(p.tierName) + '</div>' +
      '<div class="kv"><span class="k">材料</span><span class="v">' + esc(p.materialName) + '</span></div>' +
      '<div class="kv"><span class="k">规格</span><span class="v">' + esc(p.materialSpec) + '</span></div>' +
      '<div class="kv"><span class="k">工艺</span><span class="v">' + esc(p.craftNames.join(' + ') || '无') + '</span></div>' +
      '<div class="kv"><span class="k">阶梯</span><span class="v">' + esc(p.tierText) + '</span></div>' +
      '<div style="font-size:12.5px;color:var(--text-2);margin-top:6px">' + esc(p.note) + '</div>' +
      '</div>' +

      '<div class="ctx-sec"><div class="ctx-sec-t">成本拆解 · 每只</div>' + items + '</div>' +

      (acc
        ? '<div class="ctx-sec"><div class="ctx-sec-t">配件</div>' + acc +
          '<div class="kv"><span class="k">配件小计</span><span class="v">¥' + esc(rec.accessoriesTotalText) + '</span></div></div>'
        : '') +

      '<div class="total-box"><div class="tl">' + esc(p.tierName) + ' · 含配件合计</div>' +
      '<div class="tv">¥' + esc(p.grandTotalText) + '</div>' +
      '<div class="tl">货值 ¥' + esc(p.goodsAmountText) + ' ＋ 一次性 ¥' + esc(p.oneTimeText) + '</div></div>' +

      (rec.compliance && rec.compliance.length
        ? '<div class="ctx-sec" style="margin-top:16px"><div class="ctx-sec-t">合规与工艺</div><div class="req-list">' +
          rec.compliance.map((c) => '<div>' + esc(c) + '</div>').join('') +
          '</div></div>'
        : '') +
      '<div class="ctx-actions"><button class="btn primary" id="ctxSave">存入报价单</button></div>'

    const s = $('#ctxSave')
    if (s) s.addEventListener('click', () => saveQuote(rec.sceneName + ' ' + p.tierName + ' 方案'))
  }

  /* ================= 会话 ================= */
  function saveSession() {
    const first = state.messages.filter((m) => m.role === 'user')[0]
    if (!first) return
    const title = first.content.slice(0, 22)
    if (state.cur < 0) {
      state.sessions.unshift({ title, messages: state.messages.slice() })
      state.cur = 0
    } else {
      state.sessions[state.cur].title = title
      state.sessions[state.cur].messages = state.messages.slice()
    }
    renderSessions()
  }

  function renderSessions() {
    $('#sessions').innerHTML = state.sessions
      .map(
        (s, i) =>
          '<div class="session' + (i === state.cur ? ' is-on' : '') + '" data-i="' + i + '">' + esc(s.title) + '</div>'
      )
      .join('')
    $$('.session').forEach((el) =>
      el.addEventListener('click', () => {
        state.cur = Number(el.dataset.i)
        state.messages = state.sessions[state.cur].messages.slice()
        renderSessions()
      })
    )
  }

  $('#btnNewChat').addEventListener('click', () => {
    state.cur = -1
    state.messages = []
    state.rec = null
    $('#msgs').innerHTML = ''
    $('#ctxBody').innerHTML =
      '<div class="ctx-empty"><div class="ce-icon">🧩</div><p>在左边描述你的包装需求，例如：</p><p class="ce-q">「我要做一个汉堡的包装，5000 个」</p><p>这里会实时显示材料推荐、成本拆解和三档报价对比。</p></div>'
    $('#ctxScene').textContent = '—'
    renderSessions()
  })

  /* ================= 价目表 ================= */
  function loadMaterials() {
    return api.get('/api/materials').then((d) => {
      state.mats = d.list || []
      renderMatCats(d.cats || [])
      renderMats()
    })
  }

  function renderMatCats(cats) {
    $('#matCats').innerHTML = cats
      .map((c) => '<button class="fbtn' + (state.matCat === c.id ? ' is-on' : '') + '" data-c="' + c.id + '">' + esc(c.name) + '</button>')
      .join('')
    $$('#matCats .fbtn').forEach((b) =>
      b.addEventListener('click', () => {
        state.matCat = b.dataset.c
        loadMaterials()
      })
    )
  }

  function renderMats() {
    const kw = state.matKw.trim().toLowerCase()
    const list = state.mats.filter((m) => {
      if (state.matCat !== 'all' && m.cat !== state.matCat) return false
      if (!kw) return true
      return (m.name + ' ' + (m.spec || '') + ' ' + (m.supplier || '') + ' ' + m.catName).toLowerCase().indexOf(kw) > -1
    })
    $('#matCount').textContent = '共 ' + list.length + ' 种'
    $('#matTable tbody').innerHTML = list
      .map((m) => {
        const tr =
          m.trend === 'up' ? 'trend-up' : m.trend === 'down' ? 'trend-down' : 'trend-flat'
        const trTxt = m.trend === 'up' ? '↑ ' + m.trendRate + '%' : m.trend === 'down' ? '↓ ' + Math.abs(m.trendRate) + '%' : '持平'
        return (
          '<tr data-id="' + m.id + '">' +
          '<td><b>' + esc(m.name) + '</b>' + (m.custom ? ' <span class="q-tag">自定义</span>' : '') + '<div class="kb-meta">' + esc(m.note || '') + '</div></td>' +
          '<td>' + esc(m.catName) + '<div class="kb-meta">' + esc(m.subName || '') + '</div></td>' +
          '<td>' + esc(m.spec) + '</td>' +
          '<td class="num">' + esc(m.priceText) + '</td>' +
          '<td>' + esc(m.unit) + '</td>' +
          '<td>' + esc(m.supplier) + '</td>' +
          '<td>' + esc(m.updated) + '</td>' +
          '<td class="' + tr + '">' + trTxt + '</td>' +
          '<td class="op"><span class="link" data-edit="' + m.id + '">编辑</span><span class="link danger" data-del="' + m.id + '">删除</span></td>' +
          '</tr>'
        )
      })
      .join('')
    $$('#matTable [data-edit]').forEach((el) => el.addEventListener('click', () => openMatModal(el.dataset.edit)))
    $$('#matTable [data-del]').forEach((el) =>
      el.addEventListener('click', () => {
        if (!confirm('确定删除该材料？')) return
        api.del('/api/materials?id=' + encodeURIComponent(el.dataset.del)).then(() => loadMaterials())
      })
    )
  }

  $('#matSearch').addEventListener('input', (e) => {
    state.matKw = e.target.value
    renderMats()
  })

  function openMatModal(id) {
    const m = id ? state.mats.filter((x) => x.id === id)[0] : null
    $('#matModalTitle').textContent = m ? '编辑材料' : '新增材料'
    $('#mName').value = m ? m.name : ''
    $('#mCat').value = m ? m.cat : 'paper'
    $('#mSpec').value = m ? m.spec || '' : ''
    $('#mUnit').value = m ? m.unit : '元/㎡'
    $('#mGram').value = m ? m.gram || '' : ''
    $('#mTon').value = m ? m.tonPrice || '' : ''
    $('#mPrice').value = m ? m.price || '' : ''
    $('#mSupplier').value = m ? m.supplier || '' : ''
    $('#mAlias').value = ''
    $('#mNote').value = m ? m.note || '' : ''
    $('#matModal').dataset.id = id || ''
    $('#mFormula').textContent = ''
    $('#matModal').classList.add('is-on')
  }

  function closeMatModal() {
    $('#matModal').classList.remove('is-on')
  }

  $('#matModalClose').addEventListener('click', closeMatModal)
  $('#matModalCancel').addEventListener('click', closeMatModal)
  $('#btnAddMat').addEventListener('click', () => openMatModal(null))

  $('#matModalSave').addEventListener('click', () => {
    const id = $('#matModal').dataset.id || null
    const body = {
      id: id,
      name: $('#mName').value.trim(),
      cat: $('#mCat').value,
      spec: $('#mSpec').value.trim(),
      unit: $('#mUnit').value,
      gram: parseFloat($('#mGram').value) || 0,
      tonPrice: parseFloat($('#mTon').value) || 0,
      price: parseFloat($('#mPrice').value) || 0,
      supplier: $('#mSupplier').value.trim(),
      note: $('#mNote').value.trim(),
      alias: $('#mAlias').value.split('|').filter(Boolean)
    }
    if (!body.name) return toast('请填写材料名称')
    api.post('/api/materials', body).then((r) => {
      if (r.ok === false) return toast(r.message)
      closeMatModal()
      loadMaterials()
      toast('已保存')
    })
  })

  $('#btnExportCsv').addEventListener('click', () => {
    downloadCsv('/api/materials/export', 'materials.csv')
  })
  $('#btnImportCsv').addEventListener('click', () => $('#csvFile').click())
  $('#csvFile').addEventListener('change', (e) => {
    const f = e.target.files[0]
    if (!f) return
    const fr = new FileReader()
    fr.onload = () => {
      api.post('/api/materials/import', { csv: fr.result }).then((r) => {
        if (r.ok === false) return toast(r.message)
        loadMaterials()
        toast('导入成功 ' + r.result.ok + ' 条' + (r.result.errors.length ? '，' + r.result.errors.length + ' 行失败' : ''))
      })
    }
    fr.readAsText(f, 'utf-8')
    e.target.value = ''
  })
  $('#btnResetMat').addEventListener('click', () => {
    if (!confirm('恢复为内置价目库？自定义材料与修改将丢失。')) return
    api.post('/api/materials/reset', {}).then(() => {
      loadMaterials()
      toast('已恢复内置价目')
    })
  })

  /* ================= 知识库 ================= */
  function loadKb() {
    return api.get('/api/kb').then((d) => {
      $('#kbStat').textContent = '文件 ' + d.stats.total + ' 个 · 已解析 ' + d.stats.done + ' 个 · 共 ' + d.stats.chars + ' 字'
      $('#kbList').innerHTML = (d.list || [])
        .map((f) => {
          const cls = f.status === 'done' ? 'ok' : f.status === 'unsupported' ? 'warn' : 'err'
          return (
            '<div class="kb-item" data-id="' + f.id + '">' +
            '<div class="kb-ext">' + esc((f.ext || 'FILE').toUpperCase()) + '</div>' +
            '<div class="kb-main"><div class="kb-name">' + esc(f.name) + '</div>' +
            '<div class="kb-meta">' + esc(f.sizeText) + ' · ' + esc(f.method || '') + ' · ' + esc(f.createdText || '') +
            (f.message ? ' · ' + esc(f.message) : '') + '</div></div>' +
            '<div class="kb-status ' + cls + '">' + esc(f.statusText) + '</div>' +
            '<span class="link" data-viewkb="' + f.id + '">查看</span>' +
            '<span class="link danger" data-delkb="' + f.id + '">删除</span>' +
            '</div>'
          )
        })
        .join('')
      $$('[data-viewkb]').forEach((el) =>
        el.addEventListener('click', () => {
          api.get('/api/kb/content?id=' + encodeURIComponent(el.dataset.viewkb)).then((r) => {
            const item = el.closest('.kb-item')
            let box = item.querySelector('.kb-preview')
            if (box) {
              box.remove()
              return
            }
            box = document.createElement('div')
            box.className = 'kb-preview'
            box.textContent = r.content || '（无内容）'
            item.appendChild(box)
          })
        })
      )
      $$('[data-delkb]').forEach((el) =>
        el.addEventListener('click', () => {
          api.del('/api/kb?id=' + encodeURIComponent(el.dataset.delkb)).then(loadKb)
        })
      )
    })
  }

  const drop = $('#drop')
  drop.addEventListener('click', () => $('#kbFile').click())
  drop.addEventListener('dragover', (e) => {
    e.preventDefault()
    drop.classList.add('is-over')
  })
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'))
  drop.addEventListener('drop', (e) => {
    e.preventDefault()
    drop.classList.remove('is-over')
    Array.prototype.slice.call(e.dataTransfer.files).forEach(uploadFile)
  })
  $('#kbFile').addEventListener('change', (e) => {
    Array.prototype.slice.call(e.target.files).forEach(uploadFile)
    e.target.value = ''
  })

  function uploadFile(f) {
    const fr = new FileReader()
    fr.onload = () => {
      const b64 = String(fr.result).split(',')[1]
      api
        .post('/api/kb/upload', { name: f.name, base64: b64 })
        .then((r) => {
          if (r.ok === false) return toast(r.message)
          toast('已导入：' + f.name)
          loadKb()
        })
        .catch(() => toast('上传失败'))
    }
    fr.readAsDataURL(f)
  }

  /* ================= 报价单 ================= */
  function loadQuotes() {
    return api.get('/api/quotes').then((d) => {
      const list = d.list || []
      $('#badgeQuotes').textContent = list.length
      $('#quoteList').innerHTML = list.length
        ? list
            .map(
              (q) =>
                '<div class="quote-item" data-id="' + q.id + '">' +
                '<div class="q-top"><span class="q-name">' + esc(q.sceneName || q.materialName || '报价单') +
                '<span class="q-tag" style="margin-left:8px">' + esc(q.primaryName || '') + '</span></span>' +
                '<span class="q-amt">¥' + esc(q.totalText || q.grandTotalText || '') + '</span></div>' +
                '<div class="q-meta">' + esc(q.materialName || '') + ' · ' + esc(q.sizeText || '') + ' · ' + esc(q.qtyText || q.qty || '') + ' 只 · ' + esc(q.createdText || '') + '</div>' +
                '<div class="q-tags"><span class="q-tag">单只 ¥' + esc(q.unitPriceText || '') + '</span>' +
                '<span class="q-tag">货值 ¥' + esc(q.goodsAmountText || '') + '</span>' +
                '<span class="q-tag">一次性 ¥' + esc(q.oneTimeText || '') + '</span>' +
                (q.craftText ? '<span class="q-tag">' + esc(q.craftText) + '</span>' : '') +
                '</div>' +
                '<div class="msgfoot"><span class="link danger" data-delq="' + q.id + '">删除</span></div>' +
                '</div>'
            )
            .join('')
        : '<div class="ctx-empty">还没有报价单，在对话里点「存入报价单」即可保存。</div>'
      $$('[data-delq]').forEach((el) =>
        el.addEventListener('click', () => {
          api.del('/api/quotes?id=' + encodeURIComponent(el.dataset.delq)).then(loadQuotes)
        })
      )
    })
  }

  $('#btnExportQuotes').addEventListener('click', () => {
    downloadCsv('/api/quotes/export', 'quotes.csv')
  })

  /* ================= 设置 ================= */
  function loadConfig() {
    return api.get('/api/config').then((c) => {
      state.cfg = c
      $('#cfgEnabled').checked = !!c.llm.enabled
      $('#cfgBaseUrl').value = c.llm.baseUrl || ''
      $('#cfgApiKey').value = ''
      $('#cfgApiKey').placeholder = c.llm.hasKey ? '已保存（' + (c.llm.apiKeyMasked || '') + '），留空表示不修改' : 'sk-...'
      $('#cfgModel').value = c.llm.model || ''
      $('#cfgTemp').value = c.llm.temperature == null ? 0.4 : c.llm.temperature
    })
  }

  $('#btnSaveCfg').addEventListener('click', () => {
    const body = {
      llm: {
        enabled: $('#cfgEnabled').checked,
        baseUrl: $('#cfgBaseUrl').value.trim(),
        model: $('#cfgModel').value.trim(),
        temperature: parseFloat($('#cfgTemp').value)
      }
    }
    const k = $('#cfgApiKey').value.trim()
    if (k) body.llm.apiKey = k
    api.post('/api/config', body).then(() => {
      toast('已保存')
      loadState()
    })
  })

  $('#btnTestLlm').addEventListener('click', () => {
    const out = $('#testOut')
    out.className = 'test-out'
    out.textContent = '测试中…'
    api.post('/api/llm/test', {}).then((r) => {
      out.className = 'test-out ' + (r.ok ? 'ok' : 'err')
      out.textContent = r.message
    })
  })

  $('#toggleLLM').addEventListener('change', () => {
    loadState()
    toast($('#toggleLLM').checked ? '已开启大模型润色' : '已关闭，使用本地引擎')
  })

  /* ================= 运行模式探测 ================= */
  function detectMode() {
    if (window.PQ_STATIC && window.PQService) {
      MODE = 'static'
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), 1500)
      fetch('/api/state')
        .then((r) => {
          clearTimeout(timer)
          const ct = r.headers.get('content-type') || ''
          resolve(r.ok && ct.indexOf('json') > -1)
        })
        .catch(() => {
          clearTimeout(timer)
          resolve(false)
        })
    }).then((ok) => {
      MODE = ok ? 'server' : window.PQService ? 'static' : 'server'
    })
  }

  function renderModeCard() {
    const wrap = document.querySelector('#view-settings .settings')
    if (!wrap || document.getElementById('modeCard')) return
    const isStatic = MODE === 'static'
    const box = document.createElement('div')
    box.className = 'card'
    box.id = 'modeCard'
    box.innerHTML =
      '<div class="card-head">运行模式：' +
      (isStatic ? '静态版（浏览器内运行）' : '服务端模式（node server.js）') +
      '</div>' +
      '<ul class="notes">' +
      (isStatic
        ? '<li>报价、场景推荐、知识库解析<strong>全部在浏览器内完成</strong>，不依赖任何服务器。</li>' +
          '<li>数据存在<strong>本机浏览器 localStorage</strong>：换电脑、换浏览器或清理缓存后，知识库与报价单不会同步。</li>' +
          '<li>API Key 存于本机浏览器，请求由浏览器直连厂商；需厂商支持跨域（DeepSeek / Kimi / 智谱 / OpenAI 均可）。</li>'
        : '<li>接口由本机 node server.js 提供，数据存放在工程 data/ 目录。</li>' +
          '<li>API Key 保存在服务端 data/config.json，不经过浏览器；同一台服务可多人共享知识库与价目表。</li>') +
      '</ul>'
    wrap.insertBefore(box, wrap.firstChild)
  }

  /* ================= 启动 ================= */
  detectMode()
    .then(() => {
      renderModeCard()
      loadState()

      /* #demo 自动演示：打开即发送汉堡需求 */
      if (location.hash === '#demo') {
        setTimeout(() => {
          $('#input').value = '我要做一个汉堡的包装，5000 个'
          send()
        }, 500)
      }
    })
    .catch(() => loadState())
})()
