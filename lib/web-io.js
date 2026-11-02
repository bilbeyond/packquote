/**
 * 浏览器存储后端 + 服务装配（GitHub Pages 静态版专用）
 * ------------------------------------------------------------------
 * 静态版没有服务端：所有计算在浏览器内完成，数据存 localStorage。
 * 业务逻辑与 Node 版完全共用 lib/service.js。
 */
const store = require('store')
const kb = require('kb')
const engine = require('quote-engine')
const materials = require('materials')
const recommend = require('recommend')
const pricelist = require('pricelist')
const llm = require('llm')
const service = require('service')

const PREFIX = 'pq'
const keyOf = (p) => PREFIX + ':' + String(p).replace(/\\/g, '/')

function install() {
  store.setIO({
    existsSync: (p) => {
      try {
        return localStorage.getItem(keyOf(p)) !== null
      } catch (e) {
        return false
      }
    },
    mkdirSync: () => true,
    readFileSync: (p) => {
      try {
        return localStorage.getItem(keyOf(p)) || ''
      } catch (e) {
        return ''
      }
    },
    writeFileSync: (p, d) => {
      try {
        localStorage.setItem(keyOf(p), d)
      } catch (e) {
        throw new Error('浏览器本地存储已满（约 5MB），请到知识库删除部分文件后重试')
      }
      return true
    },
    unlinkSync: (p) => {
      try {
        localStorage.removeItem(keyOf(p))
      } catch (e) {}
    }
  })

  return service.createService({ engine, materials, recommend, pricelist, store, kb, llm })
}

const api = install()

/* eslint-disable no-undef */
if (typeof window !== 'undefined') {
  window.PQService = api
  window.PQ_STATIC = true
}

module.exports = api
