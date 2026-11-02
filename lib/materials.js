/**
 * 包装材料价目库
 * ------------------------------------------------------------------
 * 纸类价格按「元/㎡」计价，由克重与吨价推导，保证报价可追溯、可复算：
 *     单价(元/㎡) = 克重(g/㎡) × 吨价(元/吨) ÷ 1,000,000
 * 塑料 / 金属 / 缓冲 / 辅料 直接给定市场单价。
 * ------------------------------------------------------------------
 * 正式上线时把这里换成接口返回即可（字段保持一致）。
 */

const round2 = (n) => Math.round(n * 100) / 100

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'paper', name: '纸类' },
  { id: 'plastic', name: '塑料类' },
  { id: 'metal', name: '金属类' },
  { id: 'cushion', name: '缓冲材料' },
  { id: 'aux', name: '辅料' }
]

const PAPER_SUBS = [
  { id: 'all', name: '全部纸类' },
  { id: 'corrugated', name: '瓦楞' },
  { id: 'card', name: '卡纸' },
  { id: 'thin', name: '薄纸' },
  { id: 'special', name: '特种纸' }
]

const MATERIALS = [
  /* ---------------- 纸类 · 瓦楞 ---------------- */
  {
    id: 'p_cor_e',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 E 楞（三层）',
    alias: ['瓦楞纸', '瓦楞纸板', '瓦楞', '纸箱', '三层瓦楞', 'e楞', 'e瓦', '快递箱', '外箱'],
    spec: 'E 楞 · 3mm · 三层',
    gram: 500,
    tonPrice: 4000,
    unit: '元/㎡',
    supplier: '华东纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 2.6,
    note: '最常用快递箱材质，挺度适中，适合 3–15kg 内装物'
  },
  {
    id: 'p_cor_a',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 A 楞（三层）',
    alias: ['a楞', 'a瓦', '大楞', '重型纸箱'],
    spec: 'A 楞 · 5mm · 三层',
    gram: 650,
    tonPrice: 3950,
    unit: '元/㎡',
    supplier: '华东纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 2.1,
    note: '缓冲性能好，适合易碎品、异形内装物'
  },
  {
    id: 'p_cor_bc',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 BC 楞（五层）',
    alias: ['bc楞', '五层瓦楞', '五层纸箱', '重型箱', '双瓦'],
    spec: 'BC 楞 · 8mm · 五层',
    gram: 900,
    tonPrice: 3900,
    unit: '元/㎡',
    supplier: '联合包装',
    updated: '2026-10-29',
    trend: 'flat',
    trendRate: 0,
    note: '承重 20kg 以上，出口运输首选'
  },
  {
    id: 'p_cor_f',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞纸板 F 楞（微细）',
    alias: ['f楞', 'f瓦', '微型瓦楞', '精细瓦楞'],
    spec: 'F 楞 · 1.6mm · 三层',
    gram: 380,
    tonPrice: 4100,
    unit: '元/㎡',
    supplier: '精工纸品',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.4,
    note: '表面平整，可直印，适合小家电与美妆礼盒'
  },
  {
    id: 'p_cor_liner',
    cat: 'paper',
    sub: 'corrugated',
    name: '瓦楞芯纸 105g',
    alias: ['芯纸', '瓦楞芯', '中芯纸', '里纸'],
    spec: '105g / 卷筒',
    gram: 105,
    tonPrice: 3150,
    unit: '元/㎡',
    supplier: '华东纸业',
    updated: '2026-10-26',
    trend: 'down',
    trendRate: -1.8,
    note: '瓦楞成型用芯纸，多用于自制纸板核算'
  },

  /* ---------------- 纸类 · 卡纸 ---------------- */
  {
    id: 'p_card_300',
    cat: 'paper',
    sub: 'card',
    name: '白卡纸 300g',
    alias: ['白卡', '白卡纸', '卡纸', '单粉卡', '纸盒', '包装盒'],
    spec: '300g · 787×1092mm',
    gram: 300,
    tonPrice: 5900,
    unit: '元/㎡',
    supplier: '晨鸣纸业',
    updated: '2026-10-31',
    trend: 'up',
    trendRate: 3.2,
    note: '彩盒最常用克重，四色印刷效果佳'
  },
  {
    id: 'p_card_350',
    cat: 'paper',
    sub: 'card',
    name: '白卡纸 350g',
    alias: ['350g白卡', '厚白卡', '天地盖', '礼盒'],
    spec: '350g · 787×1092mm',
    gram: 350,
    tonPrice: 5900,
    unit: '元/㎡',
    supplier: '晨鸣纸业',
    updated: '2026-10-31',
    trend: 'up',
    trendRate: 3.2,
    note: '挺度高，适合需要手感的礼盒、化妆品盒'
  },
  {
    id: 'p_food_card',
    cat: 'paper',
    sub: 'card',
    name: '食品级白卡 350g',
    alias: ['食品级', '食品卡', '食品包装', 'fsc', '接触食品'],
    spec: '350g · 食品级/FDA',
    gram: 350,
    tonPrice: 7400,
    unit: '元/㎡',
    supplier: '太阳纸业',
    updated: '2026-10-25',
    trend: 'flat',
    trendRate: 0,
    note: '可直接接触食品，含 FDA 检测报告'
  },
  {
    id: 'p_grey_15',
    cat: 'paper',
    sub: 'card',
    name: '灰板纸 1.5mm',
    alias: ['灰板', '灰板纸', '纸板', '精装盒', '硬纸板'],
    spec: '1.5mm · 1100g',
    gram: 1100,
    tonPrice: 4350,
    unit: '元/㎡',
    supplier: '景兴纸业',
    updated: '2026-10-24',
    trend: 'down',
    trendRate: -0.9,
    note: '精装盒骨架，通常裱纸后使用'
  },
  {
    id: 'p_grey_25',
    cat: 'paper',
    sub: 'card',
    name: '灰板纸 2.5mm',
    alias: ['2.5灰板', '厚灰板', '重型精装'],
    spec: '2.5mm · 1850g',
    gram: 1850,
    tonPrice: 4350,
    unit: '元/㎡',
    supplier: '景兴纸业',
    updated: '2026-10-24',
    trend: 'down',
    trendRate: -0.9,
    note: '高档酒盒、珠宝盒'
  },

  /* ---------------- 纸类 · 薄纸 ---------------- */
  {
    id: 'p_coated_157',
    cat: 'paper',
    sub: 'thin',
    name: '铜版纸 157g',
    alias: ['铜版纸', '双铜', '彩页', '说明书', '画册'],
    spec: '157g · 889×1194mm',
    gram: 157,
    tonPrice: 6350,
    unit: '元/㎡',
    supplier: '金东纸业',
    updated: '2026-10-28',
    trend: 'up',
    trendRate: 1.7,
    note: '印刷色彩饱和，用于彩页、说明书、贴纸底纸'
  },
  {
    id: 'p_offset_80',
    cat: 'paper',
    sub: 'thin',
    name: '双胶纸 80g',
    alias: ['双胶纸', '胶版纸', '书写纸', '内衬纸', '说明纸'],
    spec: '80g · 787×1092mm',
    gram: 80,
    tonPrice: 5500,
    unit: '元/㎡',
    supplier: '太阳纸业',
    updated: '2026-10-28',
    trend: 'flat',
    trendRate: 0,
    note: '包装内衬说明书、合格证用纸'
  },
  {
    id: 'p_kraft_120',
    cat: 'paper',
    sub: 'thin',
    name: '牛皮纸 120g',
    alias: ['牛皮纸', '牛皮纸袋', '纸袋', '手提袋', '环保袋'],
    spec: '120g · 本色',
    gram: 120,
    tonPrice: 6900,
    unit: '元/㎡',
    supplier: '玖龙纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 4.5,
    note: '环保风纸袋主力材质，可覆膜提升质感'
  },
  {
    id: 'p_kraft_card_200',
    cat: 'paper',
    sub: 'thin',
    name: '牛卡纸 200g',
    alias: ['牛卡', '牛卡纸', '黄牛皮', '厚牛皮'],
    spec: '200g · 本色',
    gram: 200,
    tonPrice: 5800,
    unit: '元/㎡',
    supplier: '玖龙纸业',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 4.5,
    note: '抗张强度高，用于重型纸袋与箱板面纸'
  },
  {
    id: 'p_glassine_60',
    cat: 'paper',
    sub: 'special',
    name: '硫酸纸 60g',
    alias: ['硫酸纸', '描图纸', '半透明纸', '隔纸'],
    spec: '60g · 半透明',
    gram: 60,
    tonPrice: 12500,
    unit: '元/㎡',
    supplier: '恒安纸品',
    updated: '2026-10-22',
    trend: 'flat',
    trendRate: 0,
    note: '半透明隔层、食品垫纸'
  },
  {
    id: 'p_honey_10',
    cat: 'paper',
    sub: 'special',
    name: '蜂窝纸板 10mm',
    alias: ['蜂窝纸板', '蜂窝纸', '蜂窝', '环保缓冲'],
    spec: '10mm · 700g',
    gram: 700,
    tonPrice: 4600,
    unit: '元/㎡',
    supplier: '绿源蜂窝',
    updated: '2026-10-21',
    trend: 'down',
    trendRate: -2.3,
    note: '替代泡沫的环保缓冲材料，可裁切内衬'
  },

  /* ---------------- 塑料类 ---------------- */
  {
    id: 's_pe_bag',
    cat: 'plastic',
    sub: 'bag',
    name: 'PE 快递袋 0.05mm',
    alias: ['快递袋', 'pe袋', '塑料袋子', '包装袋', '塑料袋', 'pe'],
    spec: '0.05mm · 双层',
    price: 0.95,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-31',
    trend: 'down',
    trendRate: -2.1,
    note: '电商发货主力，可加印单色 logo'
  },
  {
    id: 's_bubble',
    cat: 'plastic',
    sub: 'bag',
    name: '气泡袋（双层）',
    alias: ['气泡袋', '气泡膜', '气垫袋', '防震袋'],
    spec: '10mm 气泡 · 双层',
    price: 1.35,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-31',
    trend: 'flat',
    trendRate: 0,
    note: '轻小件防震，可做自封口'
  },
  {
    id: 's_epe_10',
    cat: 'plastic',
    sub: 'foam',
    name: 'EPE 珍珠棉 10mm',
    alias: ['珍珠棉', 'epe', 'epe棉', '内衬棉', '防震棉'],
    spec: '10mm · 25kg/m³',
    price: 4.4,
    unit: '元/㎡',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '电子产品内衬，可模切异形'
  },
  {
    id: 's_epe_20',
    cat: 'plastic',
    sub: 'foam',
    name: 'EPE 珍珠棉 20mm',
    alias: ['20mm珍珠棉', '厚珍珠棉', '珍珠棉内衬'],
    spec: '20mm · 25kg/m³',
    price: 8.6,
    unit: '元/㎡',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '精密仪器、玻璃制品内衬'
  },
  {
    id: 's_epe_30',
    cat: 'plastic',
    sub: 'foam',
    name: 'EPE 珍珠棉 30mm',
    alias: ['30mm珍珠棉', '超厚珍珠棉'],
    spec: '30mm · 25kg/m³',
    price: 12.8,
    unit: '元/㎡',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '重型设备运输包装'
  },
  {
    id: 's_pet_05',
    cat: 'plastic',
    sub: 'sheet',
    name: 'PET 透明片材 0.5mm',
    alias: ['pet', 'pet片', '透明片', '吸塑', '折盒'],
    spec: '0.5mm · 透明',
    price: 6.8,
    unit: '元/㎡',
    supplier: '鸿达塑胶',
    updated: '2026-10-26',
    trend: 'flat',
    trendRate: 0,
    note: '透明折盒、吸塑内托，展示效果好'
  },
  {
    id: 's_pp_hollow',
    cat: 'plastic',
    sub: 'sheet',
    name: 'PP 中空板 3mm',
    alias: ['中空板', 'pp中空板', '瓦楞塑料板', '周转板'],
    spec: '3mm · 可印刷',
    price: 7.2,
    unit: '元/㎡',
    supplier: '鸿达塑胶',
    updated: '2026-10-26',
    trend: 'up',
    trendRate: 0.8,
    note: '可折叠周转箱、防潮隔板'
  },
  {
    id: 's_wrap',
    cat: 'plastic',
    sub: 'film',
    name: 'PE 缠绕膜 0.02mm',
    alias: ['缠绕膜', '拉伸膜', '打包膜', '保鲜膜'],
    spec: '0.02mm × 500mm',
    price: 1.1,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-31',
    trend: 'down',
    trendRate: -2.1,
    note: '托盘打包，按用量计价'
  },
  {
    id: 's_vacuum',
    cat: 'plastic',
    sub: 'bag',
    name: 'PA/PE 真空袋 0.09mm',
    alias: ['真空袋', '复合袋', '食品真空', 'pa/pe'],
    spec: '0.09mm · 七层共挤',
    price: 3.6,
    unit: '元/㎡',
    supplier: '恒信塑业',
    updated: '2026-10-25',
    trend: 'flat',
    trendRate: 0,
    note: '食品真空、生鲜包装'
  },

  /* ---------------- 金属类 ---------------- */
  {
    id: 'm_tin',
    cat: 'metal',
    sub: 'tin',
    name: '马口铁 0.23mm',
    alias: ['马口铁', '铁盒', '金属盒', '铁罐', 'tin'],
    spec: '0.23mm · 镀锡',
    price: 22.5,
    unit: '元/㎡',
    supplier: '宝钢金属',
    updated: '2026-10-29',
    trend: 'up',
    trendRate: 1.9,
    note: '高档礼盒、茶叶罐，需另计模具费'
  },
  {
    id: 'm_foil',
    cat: 'metal',
    sub: 'foil',
    name: '铝箔 0.02mm',
    alias: ['铝箔', '铝箔纸', '锡纸', '铝箔袋'],
    spec: '0.02mm · 纯铝',
    price: 12.8,
    unit: '元/㎡',
    supplier: '南山铝业',
    updated: '2026-10-29',
    trend: 'up',
    trendRate: 1.9,
    note: '阻隔性最好，常与塑料复合'
  },
  {
    id: 'm_alu_film',
    cat: 'metal',
    sub: 'foil',
    name: '铝塑复合膜 0.12mm',
    alias: ['铝塑膜', '复合铝膜', '药品包装'],
    spec: '0.12mm · 四层复合',
    price: 5.6,
    unit: '元/㎡',
    supplier: '南山铝业',
    updated: '2026-10-23',
    trend: 'flat',
    trendRate: 0,
    note: '药品、咖啡、宠物食品袋'
  },

  /* ---------------- 缓冲材料 ---------------- */
  {
    id: 'c_air',
    cat: 'cushion',
    sub: 'air',
    name: '气柱袋（卷材）',
    alias: ['气柱袋', '气柱', '充气袋', '空气柱'],
    spec: '宽 200mm · 可裁切',
    price: 3.2,
    unit: '元/㎡',
    supplier: '安捷缓冲',
    updated: '2026-10-30',
    trend: 'down',
    trendRate: -1.2,
    note: '替代泡沫，防摔性能好，仓储体积小'
  },
  {
    id: 'c_eps',
    cat: 'cushion',
    sub: 'foam',
    name: 'EPS 泡沫板 20mm',
    alias: ['泡沫', 'eps', '保丽龙', '泡沫板', '发泡胶'],
    spec: '20mm · 15kg/m³',
    price: 6.5,
    unit: '元/㎡',
    supplier: '安捷缓冲',
    updated: '2026-10-20',
    trend: 'flat',
    trendRate: 0,
    note: '成本低，部分海外市场已限制使用'
  },
  {
    id: 'c_angle_paper',
    cat: 'cushion',
    sub: 'angle',
    name: '纸护角 50×50mm',
    alias: ['纸护角', '护角', '边角保护', '护边'],
    spec: '50×50×5mm · 3m/根',
    price: 2.2,
    unit: '元/米',
    supplier: '绿源蜂窝',
    updated: '2026-10-21',
    trend: 'flat',
    trendRate: 0,
    note: '托盘边角加固，纸箱堆码防压'
  },
  {
    id: 'c_epe_angle',
    cat: 'cushion',
    sub: 'angle',
    name: 'EPE 珍珠棉护角',
    alias: ['珍珠棉护角', 'epe护角', '棉护角'],
    spec: '40×40mm · 按米计价',
    price: 1.8,
    unit: '元/米',
    supplier: '瑞丰包装',
    updated: '2026-10-27',
    trend: 'up',
    trendRate: 1.5,
    note: '家具、板材边角防磕碰'
  },
  {
    id: 'c_paper_pulp',
    cat: 'cushion',
    sub: 'pulp',
    name: '纸浆模塑内托',
    alias: ['纸浆模塑', '纸托', '环保内托', '甘蔗浆'],
    spec: '按件计价 · 需开模',
    price: 1.6,
    unit: '元/件',
    supplier: '绿源蜂窝',
    updated: '2026-10-18',
    trend: 'up',
    trendRate: 5.2,
    note: '可降解，模具费另计（约 3000 元起）'
  },

  /* ---------------- 辅料 ---------------- */
  {
    id: 'a_tape',
    cat: 'aux',
    sub: 'tape',
    name: 'BOPP 封箱胶带 48mm×100m',
    alias: ['胶带', '封箱胶带', '透明胶', 'bopp'],
    spec: '48mm × 100m / 卷',
    price: 4.2,
    unit: '元/卷',
    supplier: '永大胶粘',
    updated: '2026-10-31',
    trend: 'flat',
    trendRate: 0,
    note: '可按箱用量折算，约 1.2m/箱'
  },
  {
    id: 'a_strap',
    cat: 'aux',
    sub: 'strap',
    name: 'PET 打包带 15mm',
    alias: ['打包带', '塑钢带', '捆扎带', 'pet带'],
    spec: '15mm × 0.6mm / 米',
    price: 0.28,
    unit: '元/米',
    supplier: '永大胶粘',
    updated: '2026-10-31',
    trend: 'down',
    trendRate: -3.4,
    note: '重型托盘捆扎'
  },
  {
    id: 'a_glue',
    cat: 'aux',
    sub: 'glue',
    name: '热熔胶粒',
    alias: ['热熔胶', '胶粒', '糊盒胶', '胶水'],
    spec: 'EVA 型 / kg',
    price: 18.5,
    unit: '元/kg',
    supplier: '汉高代理',
    updated: '2026-10-24',
    trend: 'up',
    trendRate: 2.2,
    note: '糊盒机用胶，约 0.8g/只纸盒'
  },
  {
    id: 'a_ink',
    cat: 'aux',
    sub: 'ink',
    name: '水性印刷油墨',
    alias: ['油墨', '水性墨', '印刷墨', '墨水'],
    spec: '四色基础墨 / kg',
    price: 32,
    unit: '元/kg',
    supplier: '杭华油墨',
    updated: '2026-10-23',
    trend: 'flat',
    trendRate: 0,
    note: '柔印/胶印通用，环保型'
  },
  {
    id: 'a_staple',
    cat: 'aux',
    sub: 'hardware',
    name: '纸箱扁丝（钉线）',
    alias: ['扁丝', '钉线', '纸箱钉', '打钉'],
    spec: '17# / kg',
    price: 12,
    unit: '元/kg',
    supplier: '永大胶粘',
    updated: '2026-10-22',
    trend: 'flat',
    trendRate: 0,
    note: '纸箱打钉，约 0.5g/钉'
  },
  {
    id: 'a_label',
    cat: 'aux',
    sub: 'label',
    name: '不干胶标签 100×80mm',
    alias: ['标签', '不干胶', '贴纸', '条码标签'],
    spec: '100×80mm · 铜版不干胶',
    price: 0.06,
    unit: '元/张',
    supplier: '恒安纸品',
    updated: '2026-10-29',
    trend: 'up',
    trendRate: 1.1,
    note: '含模切与排废，可变量打印'
  },

  /* ---------------- 食品接触级（餐饮包装） ---------------- */
  {
    id: 'p_grease_40',
    cat: 'paper',
    sub: 'special',
    name: '防油纸 40g（食品级）',
    alias: ['防油纸', '油纸', '汉堡纸', '防油', '食品级防油纸'],
    spec: '40g · 食品级防油',
    gram: 40,
    tonPrice: 9200,
    unit: '元/㎡',
    supplier: '金光食品纸',
    updated: '2026-10-31',
    trend: 'up',
    trendRate: 3.2,
    note: '直接接触油炸食品必备，耐油 100℃/30min，符合 GB 4806.8'
  },
  {
    id: 'p_pe_coated_220',
    cat: 'paper',
    sub: 'special',
    name: 'PE 单面淋膜纸 220g',
    alias: ['淋膜纸', 'pe淋膜', '防渗漏', '薯条盒纸'],
    spec: '220g · 单面 PE 淋膜',
    gram: 220,
    tonPrice: 7800,
    unit: '元/㎡',
    supplier: '金光食品纸',
    updated: '2026-10-31',
    trend: 'flat',
    trendRate: 0,
    note: '薯条盒 / 炸鸡桶常用，防渗漏、可热封'
  },
  {
    id: 'p_kraft_food_70',
    cat: 'paper',
    sub: 'thin',
    name: '食品级牛皮纸 70g',
    alias: ['食品级牛皮纸', '食品牛皮', '汉堡包装纸'],
    spec: '70g · 本色 · 食品级',
    gram: 70,
    tonPrice: 8600,
    unit: '元/㎡',
    supplier: '金光食品纸',
    updated: '2026-10-30',
    trend: 'up',
    trendRate: 1.8,
    note: '本色质感，适合轻食 / 汉堡裹纸，可印水性油墨'
  },
  {
    id: 'c_pulp_tray',
    cat: 'cushion',
    sub: 'pulp',
    name: '纸浆模塑杯托（4 格）',
    alias: ['杯托', '纸浆杯托', '模塑托', '饮料托'],
    spec: '4 格 · 甘蔗浆',
    price: 0.85,
    unit: '元/件',
    supplier: '绿源模塑',
    updated: '2026-10-28',
    trend: 'down',
    trendRate: 2.4,
    note: '甘蔗浆可降解，替代塑料杯托，需开模费'
  }
]

/* 纸类单价由克重与吨价推导，保证数字自洽可复算 */
MATERIALS.forEach((m) => {
  if (m.cat === 'paper' && m.gram && m.tonPrice) {
    m.price = round2((m.gram * m.tonPrice) / 1000000)
  }
})

const CAT_MAP = {
  paper: '纸类',
  plastic: '塑料类',
  metal: '金属类',
  cushion: '缓冲材料',
  aux: '辅料'
}

const SUB_MAP = {}
PAPER_SUBS.forEach((s) => {
  SUB_MAP['paper_' + s.id] = s.name
})

function catName(cat) {
  return CAT_MAP[cat] || '其他'
}

function subName(cat, sub) {
  if (cat !== 'paper') return ''
  const hit = PAPER_SUBS.find((s) => s.id === sub)
  return hit && hit.id !== 'all' ? hit.name : ''
}

function formatPrice(price) {
  if (price >= 10) return price.toFixed(2)
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(3)
}

/**
 * 价目表查询
 * @param {{cat?:string, sub?:string, keyword?:string, sort?:'price-asc'|'price-desc'|'updated'}} opt
 */
function query(opt) {
  const o = opt || {}
  let list = MATERIALS.slice()

  if (o.cat && o.cat !== 'all') {
    list = list.filter((m) => m.cat === o.cat)
  }
  if (o.sub && o.sub !== 'all') {
    list = list.filter((m) => m.sub === o.sub)
  }
  if (o.keyword) {
    const kw = String(o.keyword).trim().toLowerCase()
    if (kw) {
      list = list.filter((m) => {
        const hay = [m.name, m.spec, m.supplier, catName(m.cat)]
          .concat(m.alias || [])
          .join(' ')
          .toLowerCase()
        return hay.indexOf(kw) > -1
      })
    }
  }

  if (o.sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (o.sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price)
  } else {
    list.sort((a, b) => (a.updated < b.updated ? 1 : -1))
  }

  return list.map((m) => view(m))
}

/** 给视图层用的扁平结构 */
function view(m) {
  return {
    id: m.id,
    cat: m.cat,
    catName: catName(m.cat),
    sub: m.sub,
    subName: subName(m.cat, m.sub),
    name: m.name,
    spec: m.spec,
    unit: m.unit,
    price: m.price,
    priceText: formatPrice(m.price),
    gram: m.gram || 0,
    tonPrice: m.tonPrice || 0,
    supplier: m.supplier,
    updated: m.updated,
    trend: m.trend,
    trendRate: m.trendRate || 0,
    note: m.note,
    formula:
      m.cat === 'paper' && m.gram
        ? `${m.gram}g/㎡ × ${m.tonPrice}元/吨 ÷ 10⁶ = ${formatPrice(m.price)} 元/㎡`
        : '市场流通价（含税）',
    alias: m.alias
  }
}

function getById(id) {
  const m = MATERIALS.find((x) => x.id === id)
  return m ? view(m) : null
}

function countByCat() {
  const res = { all: MATERIALS.length, paper: 0, plastic: 0, metal: 0, cushion: 0, aux: 0 }
  MATERIALS.forEach((m) => {
    res[m.cat] = (res[m.cat] || 0) + 1
  })
  return res
}

/** 纸类均价（元/㎡），用于汇总页展示 */
function paperAvg() {
  const papers = MATERIALS.filter((m) => m.cat === 'paper')
  const sum = papers.reduce((s, m) => s + m.price, 0)
  return Math.round((sum / papers.length) * 100) / 100
}

/**
 * 从自然语言里匹配材料：取命中的最长别名，避免「白卡」压过「食品级白卡」之类的短词误命中
 */
function matchByText(text) {
  const t = String(text || '').toLowerCase()
  if (!t) return null
  let best = null
  let bestLen = 0
  MATERIALS.forEach((m) => {
    const keys = [m.name].concat(m.alias || [])
    keys.forEach((k) => {
      const kk = String(k).toLowerCase()
      if (kk && t.indexOf(kk) > -1 && kk.length > bestLen) {
        best = m
        bestLen = kk.length
      }
    })
  })
  return best
}

module.exports = {
  CATEGORIES,
  PAPER_SUBS,
  MATERIALS,
  catName,
  subName,
  formatPrice,
  query,
  view,
  getById,
  countByCat,
  paperAvg,
  matchByText
}
