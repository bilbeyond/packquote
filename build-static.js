/**
 * 构建 GitHub Pages 静态版
 * ------------------------------------------------------------------
 * 把 lib/ 下的 CommonJS 模块打包成一个浏览器可用的 IIFE（含简易模块加载器），
 * 连同 public/ 的前端资源输出到 docs/ —— docs/ 即 Pages 的发布源。
 *
 * 用法：node build-static.js
 */
const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const LIB = path.join(ROOT, 'lib')
const PUBLIC = path.join(ROOT, 'public')
const OUT = path.join(ROOT, 'docs')

/** 打包顺序：被依赖的在前（仅影响可读性，加载为懒执行） */
const MODULES = [
  'pako.min',
  'materials',
  'quote-engine',
  'recommend',
  'docx',
  'store',
  'kb',
  'pricelist',
  'llm',
  'service',
  'web-io'
]

function wrap(name, src) {
  // require('./xxx.js') / require('./xxx') → require('xxx')
  const code = src.replace(/require\(['"]\.\/([A-Za-z0-9_.-]+?)(\.js)?['"]\)/g, "require('$1')")
  return `  __m['${name}'] = function (module, exports, require) {\n${code}\n  }\n`
}

function build() {
  const chunks = []

  chunks.push(`/*!
 * 包装材料报价智能体 · 静态版核心（自动生成，请勿手改）
 * 源文件：lib/ 下的报价引擎、场景推荐、知识库解析、服务层
 * 生成命令：node build-static.js
 */
(function () {
  var __m = {}
  var __c = {}
  var __n = function (id) {
    return String(id).replace(/^\\.\\//, '').replace(/\\.js$/, '')
  }
  var __require = function (id) {
    id = __n(id)
    if (__c[id]) return __c[id].exports
    var m = (__c[id] = { exports: {} })
    if (!__m[id]) {
      if (id === 'fs' || id === 'path' || id === 'os' || id === 'url') {
        __m[id] = function (module) {
          module.exports = {}
        }
        if (id === 'path') {
          __m[id] = function (module, exports) {
            exports.join = function () {
              return Array.prototype.slice.call(arguments).join('/').replace(/\\/+/g, '/')
            }
            exports.normalize = function (p) {
              return String(p)
            }
            exports.dirname = function (p) {
              return String(p).split('/').slice(0, -1).join('/')
            }
            exports.basename = function (p) {
              return String(p).split('/').pop()
            }
            exports.extname = function (p) {
              var s = String(p)
              var i = s.lastIndexOf('.')
              return i < 0 ? '' : s.slice(i)
            }
          }
        }
      } else {
        throw new Error('模块未打包: ' + id)
      }
    }
    __m[id](m, m.exports, __require)
    return m.exports
  }
`)

  MODULES.forEach((name) => {
    const file = path.join(LIB, name + '.js')
    if (!fs.existsSync(file)) throw new Error('缺少模块文件: ' + file)
    chunks.push(wrap(name, fs.readFileSync(file, 'utf8')))
  })

  chunks.push(`
  try {
    __require('web-io')
  } catch (e) {
    if (typeof console !== 'undefined') console.error('核心初始化失败', e)
    if (typeof window !== 'undefined') window.PQ_ERROR = e.message
  }
})()
`)

  const core = chunks.join('\n')

  /* 输出 docs/ */
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })
  const assets = path.join(OUT, 'assets')
  if (!fs.existsSync(assets)) fs.mkdirSync(assets, { recursive: true })

  fs.writeFileSync(path.join(assets, 'pq-core.js'), core, 'utf8')
  fs.copyFileSync(path.join(PUBLIC, 'styles.css'), path.join(assets, 'styles.css'))
  fs.copyFileSync(path.join(PUBLIC, 'app.js'), path.join(assets, 'app.js'))

  let html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8')
  // 指向同目录 assets 资源，并在前端脚本前注入核心包
  html = html
    .replace(/href=["']styles\.css["']/g, 'href="assets/styles.css"')
    .replace(/src=["']app\.js["']/g, 'src="assets/app.js"')
    .replace(/<script src=["']assets\/app\.js["']><\/script>/, '<script src="assets/pq-core.js"></script>\n  <script src="assets/app.js"></script>')
  if (html.indexOf('pq-core.js') === -1) {
    html = html.replace('</head>', '  <script src="assets/pq-core.js"></script>\n</head>')
  }
  fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8')

  // Pages 禁用 Jekyll
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8')

  const size = (fs.statSync(path.join(assets, 'pq-core.js')).size / 1024).toFixed(0)
  console.log('静态版已生成 → docs/')
  console.log('  docs/index.html')
  console.log('  docs/assets/pq-core.js  ' + size + ' KB')
  console.log('  docs/assets/app.js')
  console.log('  docs/assets/styles.css')
}

build()
