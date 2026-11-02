/**
 * 本地预览 GitHub Pages 静态版（docs/）
 * ------------------------------------------------------------------
 * 用途：推送到 GitHub 前，在本机确认静态版能正常跑起来。
 * 用法：node serve-static.js   → http://localhost:5199
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, 'docs')
const PORT = process.env.PORT || 5199

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
}

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('缺少 docs/index.html，请先执行： node build-static.js')
  process.exit(1)
}

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0])
    if (rel === '/' || rel === '') rel = '/index.html'
    const file = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ''))
    if (!file.startsWith(ROOT)) {
      res.writeHead(403)
      return res.end('forbidden')
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        return res.end('404 ' + rel)
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      })
      res.end(data)
    })
  })
  .listen(PORT, () => {
    console.log('')
    console.log('  静态版预览： http://localhost:' + PORT)
    console.log('  （等同于 GitHub Pages 发布后的效果，数据存浏览器 localStorage）')
    console.log('')
  })
