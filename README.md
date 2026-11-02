# 包装材料报价智能体 · 网站版（桌面端）

小程序的桌面 Web 版，新增**大模型接入**与**场景智能推荐**：说一句「我要做一个汉堡的包装，5000 个」，系统自动推荐结构方案（汉堡盒 + 防油纸 + 封口标签）、给出经济/标准/高端三档报价与逐项成本拆解，并由大模型润色推荐理由（未配置模型时由本地引擎回答，数字一样准）。

## 两种用法（同一份代码）

| 形态 | 怎么跑 | 适合 |
|---|---|---|
| **静态版** | 打开 GitHub Pages 网址即可，无需安装任何东西 | 分享给同事/客户，打开就用 |
| **服务端版** | `node server.js` → http://localhost:5173 | 自己用，数据存文件、Key 不落浏览器 |

- 静态版：报价/推荐/知识库解析全部在浏览器内完成，数据与 API Key 存本机浏览器 localStorage（换浏览器不同步）。设置页有「运行模式」说明。
- 服务端版：数据存 `data/` 目录，API Key 存服务端 `data/config.json`。

## GitHub Pages 部署（仓库管理员操作）

1. 推送本仓库到 GitHub（`docs/` 目录已包含构建好的静态版）。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **Deploy from a branch**，分支选 `main`、目录选 **`/docs`**，保存。
3. 一两分钟后访问 `https://<用户名>.github.io/<仓库名>/`。
4. 修改代码后重新生成静态版再推送：`node build-static.js` → commit `docs/`。

> 静态版无需任何密钥即可用（本地引擎）；要大模型润色，在网页「大模型设置」里填自己的 Key（存浏览器本地）。

## 快速开始（服务端版）

```bash
node server.js        # 零依赖，无需 npm install
# 打开 http://localhost:5173
```

## 功能

| 模块 | 说明 |
|---|---|
| 对话工作台 | 三栏布局：会话导航 / 对话流 / 右侧方案面板。流式输出、方案对比卡、成本拆解、一键存入报价单 |
| 场景智能推荐 | 内置 8 大品类场景库（汉堡、炸鸡小食、饮品杯托、蛋糕烘焙、快递电商、化妆品、3C 电子、礼品礼盒），自动推荐结构 + 材料 + 工艺 + 配件 + 合规要求 |
| 大模型接入 | OpenAI 兼容协议，界面可配置 baseUrl / Key / 模型 / 温度。DeepSeek、通义千问、Kimi、智谱、OpenAI、本地 Ollama 均可。服务端版 Key 存服务端；静态版存浏览器。调用失败自动降级本地引擎 |
| 材料价目表 | 43 种内置材料（含食品级防油纸、淋膜纸等餐饮材料），可增删改、CSV 导入导出、恢复内置。纸类按 元/㎡ = 克重 × 吨价 ÷ 10⁶ |
| 知识库 | 拖拽上传 docx / txt / md / csv / pdf（需文本层），解析入库，回答时按关键词打分引用原文（中文按 2 字滑窗匹配） |
| 报价单 | 对话保存 → 列表管理 → CSV 导出 |

## 报价与推荐的分工

- **本地引擎实算**：材料单价、展开面积、印刷/模切/覆膜等工艺费、数量阶梯、一次性费用。模型被 system prompt 明确禁止编造价格。
- **大模型负责**：理解模糊需求、解释「为什么推荐这个材料」、回答追问（如「换成牛皮纸呢」「打样要多久」）。
- **降级策略**：未配置 Key / 网络失败 / 超时 → 自动切本地引擎回答，并在消息里提示原因。

## 配置大模型

「大模型设置」页填写：

```
Base URL: https://api.deepseek.com/v1      （DeepSeek 示例）
API Key:  sk-...
模型:     deepseek-chat
```

通义千问：`https://dashscope.aliyuncs.com/compatible-mode/v1`；Kimi：`https://api.moonshot.cn/v1`；本地 Ollama：`http://localhost:11434/v1`（Key 随便填）。

> 静态版由浏览器直连模型 API，需厂商支持跨域（DeepSeek / Kimi / 智谱 / OpenAI 均支持；通义兼容模式支持）。

## 目录

```
packquote-web/
├─ server.js               零依赖 Node 服务（静态托管 + API + SSE 流式）
├─ lib/
│  ├─ materials.js         43 种材料价目（含食品级）
│  ├─ quote-engine.js      报价引擎（面积 / 阶梯 / 工艺）
│  ├─ recommend.js         场景推荐引擎（8 品类）
│  ├─ llm.js               OpenAI 兼容客户端 + 事实数据注入
│  ├─ kb.js                知识库解析与检索
│  ├─ pricelist.js         价目维护 / CSV
│  ├─ store.js             持久化（Node=文件 / 浏览器=localStorage，可注入）
│  ├─ service.js           业务服务层（服务端与静态版共用）
│  └─ web-io.js            浏览器存储后端装配
├─ public/                 前端源码（原生 HTML/CSS/JS，双模式自适应）
├─ docs/                   GitHub Pages 发布目录（node build-static.js 生成）
├─ build-static.js         打包静态版 → docs/
├─ serve-static.js         本地预览静态版 → http://localhost:5199
├─ data/                   服务端版运行时数据（不入库，.gitignore）
└─ test-api.js             端到端自检（23 项，node test-api.js）
```

## 自检

```bash
node test-api.js        # 服务端版接口自检
node build-static.js && node serve-static.js   # 构建并预览静态版
```

## 演示技巧

打开页面加 `#demo`（如 `http://localhost:5173/#demo` 或 Pages 网址 + `#demo`）自动发送「汉堡包装 5000 个」示例。
