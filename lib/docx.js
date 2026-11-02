/**
 * docx 正文提取（纯本地，无后端）
 * ------------------------------------------------------------------
 * docx 本质是一个 zip 包，正文在 word/document.xml。
 * 这里自己读 Zip 中央目录 + 用 pako 解 raw deflate，
 * 避免引入体积更大的 jszip。
 * 注意：只支持 .docx；老版 .doc 是二进制 OLE 格式，小程序端无法解析。
 */

const pako = require('./pako.min.js')

/* ---------------- 字节工具 ---------------- */

function toUint8(input) {
  if (input instanceof Uint8Array) return input
  if (input instanceof ArrayBuffer) return new Uint8Array(input)
  if (input && input.buffer instanceof ArrayBuffer) {
    return new Uint8Array(input.buffer, input.byteOffset || 0, input.byteLength)
  }
  throw new Error('无法识别的文件数据')
}

function utf8Decode(u8) {
  let out = ''
  let chunk = []
  let i = 0
  const len = u8.length
  while (i < len) {
    const b = u8[i++]
    let cp
    if (b < 0x80) {
      cp = b
    } else if (b >= 0xc0 && b < 0xe0) {
      cp = ((b & 0x1f) << 6) | (u8[i++] & 0x3f)
    } else if (b >= 0xe0 && b < 0xf0) {
      cp = ((b & 0x0f) << 12) | ((u8[i++] & 0x3f) << 6) | (u8[i++] & 0x3f)
    } else if (b >= 0xf0) {
      cp =
        ((b & 0x07) << 18) |
        ((u8[i++] & 0x3f) << 12) |
        ((u8[i++] & 0x3f) << 6) |
        (u8[i++] & 0x3f)
    } else {
      cp = 0xfffd
    }
    if (cp < 0 || cp > 0x10ffff) cp = 0xfffd
    chunk.push(cp)
    if (chunk.length >= 4096) {
      out += String.fromCodePoint.apply(null, chunk)
      chunk = []
    }
  }
  if (chunk.length) out += String.fromCodePoint.apply(null, chunk)
  return out
}

/* ---------------- zip 解析 ---------------- */

function findEOCD(u8, dv) {
  const min = Math.max(0, u8.length - 65557)
  for (let i = u8.length - 22; i >= min; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) return i
  }
  return -1
}

/**
 * 读取 zip 内指定文件
 * @returns {Uint8Array|null}
 */
function readZipEntry(u8, target) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength)
  const eocd = findEOCD(u8, dv)
  if (eocd < 0) throw new Error('文件不是有效的 docx（未找到 zip 目录）')

  const count = dv.getUint16(eocd + 10, true)
  const cdOffset = dv.getUint32(eocd + 16, true)

  let p = cdOffset
  for (let i = 0; i < count; i++) {
    if (p + 46 > u8.length || dv.getUint32(p, true) !== 0x02014b50) break

    const method = dv.getUint16(p + 10, true)
    const compSize = dv.getUint32(p + 20, true)
    const nameLen = dv.getUint16(p + 28, true)
    const extraLen = dv.getUint16(p + 30, true)
    const commentLen = dv.getUint16(p + 32, true)
    const localOffset = dv.getUint32(p + 42, true)
    const name = utf8Decode(u8.subarray(p + 46, p + 46 + nameLen))

    if (name === target) {
      const lNameLen = dv.getUint16(localOffset + 26, true)
      const lExtraLen = dv.getUint16(localOffset + 28, true)
      const dataStart = localOffset + 30 + lNameLen + lExtraLen
      const comp = u8.subarray(dataStart, dataStart + compSize)
      if (method === 0) return comp
      if (method === 8) return pako.inflateRaw(comp)
      throw new Error('不支持的压缩方式：' + method)
    }

    p += 46 + nameLen + extraLen + commentLen
  }
  return null
}

/* ---------------- XML → 纯文本 ---------------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => safeChar(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, k) => ENTITIES[k.toLowerCase()] || m)
}

function safeChar(code) {
  if (!code || code > 0x10ffff) return ''
  try {
    return String.fromCodePoint(code)
  } catch (e) {
    return ''
  }
}

function xmlToText(xml) {
  let s = String(xml || '')
  s = s.replace(/<w:tab[^>]*\/?>/g, '\t')
  s = s.replace(/<w:br[^>]*\/?>/g, '\n')
  s = s.replace(/<w:cr[^>]*\/?>/g, '\n')
  s = s.replace(/<\/w:p>/g, '\n')
  s = s.replace(/<\/w:tr>/g, '\n')
  s = s.replace(/<\/w:tc>/g, '\t')
  s = s.replace(/<[^>]+>/g, '')
  s = decodeEntities(s)
  s = s.replace(/[ \t]+\n/g, '\n')
  s = s.replace(/\t+\n/g, '\n')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

/**
 * 解析 docx，返回正文纯文本
 * @param {ArrayBuffer|Uint8Array} buffer
 * @returns {{text:string, paragraphs:number}}
 */
function parseDocx(buffer) {
  const u8 = toUint8(buffer)
  if (u8.length < 4 || u8[0] !== 0x50 || u8[1] !== 0x4b) {
    throw new Error('不是有效的 docx 文件')
  }
  const xmlBytes = readZipEntry(u8, 'word/document.xml')
  if (!xmlBytes) throw new Error('docx 内缺少正文（word/document.xml）')
  const xml = utf8Decode(xmlBytes)
  const text = xmlToText(xml)
  const paragraphs = (xml.match(/<\/w:p>/g) || []).length
  return { text, paragraphs }
}

module.exports = {
  parseDocx,
  xmlToText,
  utf8Decode,
  readZipEntry,
  toUint8
}
