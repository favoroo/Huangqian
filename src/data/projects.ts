export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface ProjectDetail {
  id: string;
  no: string;
  category: string;
  categoryEn: string;
  title: string;
  titleEn: string;
  tagline: string;
  description: string;
  stack: string[];
  stats: StatItem[];
  highlights: string[];
  gallery: GalleryItem[];
  links: { label: string; url: string }[];
}

export const careerItems = [
  {
    no: '01',
    name: 'EV Kit 2 · 新能源高压测量',
    role: '全流程开发：从 UE 交互设计到测量流程落地，独立自制一整套提效工具',
    result: '高压测量全流程从设计到落地完整交付',
    img: 'career-evkit',
  },
  {
    no: '02',
    name: '翻译 Agent 工具',
    role: '主导开发公司翻译 Agent，为翻译同事提供翻译与规范性整改能力',
    result: '翻译环节效率与规范性显著提升',
    img: 'career-trans',
  },
  {
    no: '03',
    name: '资料治理 Agent（知识库）',
    role: '从海量维修资料中提取信息，梳理为可检索的智能知识库',
    result: '资料治理为知识库，检索使用更高效',
    img: 'career-docs',
  },
  {
    no: '04',
    name: '四轮定位参数与流程标定',
    role: '负责四轮定位功能中定位参数与作业流程的开发',
    result: '四轮定位参数与流程稳定交付',
    img: 'career-alignment',
  },
  {
    no: '05',
    name: 'VIN 车型识别解析',
    role: '负责公司覆盖几十个汽车品牌的 VIN 车型识别解析规则与数据开发',
    result: '几十个品牌的 VIN 车型识别稳定可用',
    img: 'career-vin',
  },
  {
    no: '06',
    name: 'TPMS / IM / BT 608 技术支撑',
    role: '在海量原厂维修手册、通信协议及技术文档中精准检索、沉淀与答疑',
    result: '长期承担多项目专业技术答疑',
    img: 'career-tpms',
  },
];

export const projects: ProjectDetail[] = [
  {
    id: 'swordsman',
    no: '02.1',
    category: '游戏开发',
    categoryEn: 'GAME · GODOT',
    title: '剑士',
    titleEn: 'SWORDSMAN',
    tagline: '扛过 20 波妖魔，一战到底。',
    description:
      '一款修仙题材的俯视角自动攻击幸存者游戏（类《土豆兄弟》）。武器自动索敌出手，你只管走位、攒钱、搭构筑——选一个角色，配一身武器，看它把你的流派滚成什么样。Web 浏览器直接试玩，安卓免费下载，完全免费、没有内购、没有广告。',
    stack: ['Godot 4.7', 'GDScript', 'Jolt 物理', 'Web + Android', '独立开发'],
    stats: [
      { value: 21, label: '名角色' },
      { value: 70, label: '件武器' },
      { value: 102, label: '件道具' },
      { value: 20, label: '波通关' },
    ],
    highlights: [
      '一个人从玩法设计、数值平衡到双端上线的完整游戏开发',
      '程序化生成的角色与物品美术，200+ 图标由代码绘制',
      '自研打击感系统：创伤预算相机抖动、命中停顿与反馈分层',
      'CI 自动化测试：每次提交跑 3000+ 断言守住数值基线',
      '五套可切换主题色、悟道加点与金币阁构筑流派',
    ],
    gallery: [
      { src: 'swordsman-combat', caption: '实机战斗 · 自动索敌' },
      { src: 'swordsman-alloc', caption: '悟道加点构筑' },
      { src: 'swordsman-shop', caption: '金币阁淘宝' },
      { src: 'swordsman-synergy', caption: '武器羁绊组合' },
    ],
    links: [
      { label: '在线介绍', url: 'https://favoroo.github.io/Q-xiuxian/site/' },
      { label: 'GitHub 源码', url: 'https://github.com/favoroo/Q-xiuxian' },
    ],
  },
  {
    id: 'dudu',
    no: '02.2',
    category: '游戏开发',
    categoryEn: 'GAME · COCOS',
    title: '嘟嘟羽毛球',
    titleEn: 'DUDU BADMINTON',
    tagline: '没有体力，没有广告，打开就打。',
    description:
      '一款为手机做的羽毛球对战游戏。一根手指跑位、四个方向出球，七个主动技能随时打断对手节奏，二十关闯关各带一条独立机制，三十九款皮肤从球衣换到脸面。由零依赖 Canvas 老仓库用 Cocos Creator + TypeScript 重构，目标平台微信小游戏与 Android。',
    stack: ['Cocos Creator 3.8.8', 'TypeScript', '零图片纯代码渲染', 'Web + Android'],
    stats: [
      { value: 20, label: '关闯关' },
      { value: 7, label: '主动技能' },
      { value: 39, label: '款皮肤' },
      { value: 4, label: '座主题球馆' },
    ],
    highlights: [
      '羽毛球空气动力学弹道反解，挥拍几何与落点真实自洽',
      'core 层纯 TypeScript 零引擎依赖，可在 Node 中直接回归测试',
      '技能演示帧来自真物理模拟输出，不是画的示意图',
      '离线 WebAudio 音效烘焙管线：29 个 WAV 全自动生成',
      '速度档时间膨胀物理（重力×s²、速度×s），4 档 AI 难度',
    ],
    gallery: [
      { src: 'dudu-arena', caption: '黄昏馆 · 钢架聚光' },
      { src: 'dudu-cyber', caption: '赛博场 · 霓虹矩阵' },
      { src: 'dudu-beach', caption: '海滩 · 椰林浪花' },
      { src: 'dudu-dojo', caption: '竹林道场 · 和纸灯笼' },
    ],
    links: [
      { label: '在线介绍', url: 'https://favoroo.github.io/Dudu-Badminton/site/' },
      { label: 'GitHub 源码', url: 'https://github.com/favoroo/Dudu-Badminton' },
    ],
  },
  {
    id: 'qnote',
    no: '03.1',
    category: '移动端',
    categoryEn: 'APP · FLUTTER',
    title: 'QNote',
    titleEn: 'AI PERSONAL STEWARD',
    tagline: '让记下来的东西，真正帮到你。',
    description:
      'AI 随身记录管家。时间线速记、富文本 ⇄ Markdown 双模笔记、GTD 待办、数据统计与健康量化，全部沉淀在同一座本地数据底座上；内置智能体「小Q」——记待办、写笔记、打卡时间线、看统计，说一句就行。',
    stack: ['Flutter / Dart', 'Riverpod', 'SQLite 本地优先', 'WebDAV 同步'],
    stats: [
      { value: 14, label: '个 Agent 工具' },
      { value: 9, label: '大内置技能' },
      { value: 78, suffix: '+', label: '版本高频迭代' },
      { value: 15, label: '家 AI 服务商预设' },
    ],
    highlights: [
      '小Q 智能体：5 种人设、9 大技能、14 个工具统一读写 VFS，先落库再回执',
      '直连小米运动健康云端协议：步数、睡眠分期、心率血氧自动归档',
      '富文本 ⇄ Markdown 无损双模笔记，切换连光标位置都记得',
      '本地优先 · 零遥测 · 零账号强制，WebDAV 用自己的云做同步后端',
      '六维图表 + 每日五维生活健康总分，Android 原生桌面小组件×3',
    ],
    gallery: [],
    links: [
      { label: '在线介绍', url: 'https://favoroo.github.io/QNote/' },
      { label: 'GitHub 源码', url: 'https://github.com/favoroo/QNote' },
    ],
  },
  {
    id: 'qmenu',
    no: '03.2',
    category: '移动端',
    categoryEn: '小程序 · WECHAT',
    title: 'Q 菜单',
    titleEn: 'QMENU',
    tagline: '把每一顿饭，变成一起的事。',
    description:
      '为家人和朋友设计的微信小程序群组协作点菜工具：所有人共享一份菜谱，各自挑喜欢的菜，指定今天的大厨，再用星星记录每一道好味道。原生开发 + 云开发，六个细节让做饭这件事轻松一点。',
    stack: ['微信小程序原生', '微信云开发', '云函数 ×14', '群组数据隔离'],
    stats: [
      { value: 20, label: '人群组上限' },
      { value: 14, label: '个云函数' },
      { value: 9, label: '个页面' },
      { value: 8, label: '个数据集合' },
    ],
    highlights: [
      '三层缓存数据流：本地 → 内存 → 云端并行校正，首屏不等网络',
      '乐观更新失败自动回滚；6 位邀请码 + 群组级硬隔离',
      '订阅消息把购物清单直接推送给今天的大厨',
      '厨师排行榜与美味度/难度双维度评分',
      '每日凌晨定时云函数自动回收孤儿图片，存储零浪费',
    ],
    gallery: [
      { src: 'qmenu-food-1', caption: '共享菜谱 · 各点各的' },
      { src: 'qmenu-food-2', caption: '一起下单 · 星星记录' },
    ],
    links: [
      { label: '在线介绍', url: 'https://favoroo.github.io/Qmenu/' },
      { label: 'GitHub 源码', url: 'https://github.com/favoroo/Qmenu' },
    ],
  },
];

export const careerProject: ProjectDetail = {
  id: 'career',
  no: '01',
  category: '公司经历',
  categoryEn: 'CAREER · AUTOTEL',
  title: '汽车技术工程师',
  titleEn: 'AUTOMOTIVE ENGINEER',
  tagline: '从传统技术开发者，到部门 AI 提效负责人。',
  description:
    '扎根汽车工程一线实践，持续探索工程标准化与 AI 工具提效。在四轮定位、VIN 码解析和新能源高压测量等核心业务中积累扎实落地经验，近两年主导推进部门翻译 Agent、资料治理与智能知识库等工具的设计与落地，用数字化工具重塑团队生产力。',
  stack: ['新能源高压测量', 'AI Agent 工具', '知识库治理', '数据开发', 'UE 交互设计'],
  stats: [
    { value: 6, label: '个核心项目' },
    { value: 3, label: '类 AI Agent 工具' },
    { value: 50, suffix: '+', label: '个解析品牌' },
    { value: 4, label: '年持续提效' },
  ],
  highlights: [
    'EV Kit 2：高压测量全流程从 UE 交互设计到测量落地完整交付',
    '翻译 Agent 与资料治理 Agent：以 AI 工具重塑团队生产力',
    'VIN 车型识别：覆盖几十个品牌的解析规则与数据开发',
    '四轮定位：定位参数与作业流程标定稳定交付',
    '现任部门 AI 提效负责人，推动工程实践数字化',
  ],
  gallery: [
    { src: 'career-evkit', caption: 'EV Kit 2 高压测量' },
    { src: 'career-trans', caption: '翻译 Agent 工具' },
    { src: 'career-docs', caption: '资料治理知识库' },
  ],
  links: [
    { label: '完整职业主页', url: 'https://favoroo.github.io/Q-profile/' },
  ],
};
