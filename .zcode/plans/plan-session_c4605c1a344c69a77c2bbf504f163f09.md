# 黄谦个人网站 — Swiss International Style 作品集

## 目标
新建单页作品集网站，介绍公司经历 + 5 个开发项目，瑞士国际主义风格，中文为主 + 英文点缀，部署到 `https://github.com/favoroo/Huangqian` → GitHub Pages（`favoroo.github.io/Huangqian/`）。工作区：`/Users/a1/Documents/01Code/01-个人网站`（当前为空）。

## 技术栈
- Vite + 原生 HTML/CSS/TypeScript（无框架、无 Tailwind——CSS 自定义属性实现 Swiss token 体系，便于精确控制网格与排版）
- 动画：手写 IntersectionObserver 滚动入场 + CSS clip-path/遮罩，遵守 `duration-150 ease-out` 悬停上限；入场动画属于"版面激活"不计入悬停限制，且提供 `prefers-reduced-motion` 降级
- 部署：GitHub Actions（Node 20 → `npm ci && npm run build` → upload-pages-artifact），`vite.config.ts` 设 `base: '/Huangqian/'`

## 网站结构（单页 + 详情浮层）

**固定侧栏/顶栏导航**：`HQ/` logo + 编号导航 01–05，小字大写宽字距；移动端为顶部单行 + 全屏网格菜单。

1. **Hero（首屏）**：超大黑色标题左对齐、紧凑行高 —— "黄谦。" + 主标语"从汽车工程到 AI 提效，从代码到游戏"；红黑白巨字排版 + 细网格线；英文点缀标签 `AUTOMOTIVE ENGINEER / GAME DEVELOPER / INDIE BUILDER`；红方块 CTA "查看作品 ↓"（带箭头方向性）；AI 生成的瑞士几何海报图作右侧/背景视觉锚点；可选 BGM 静音小开关（`♪`，默认关，localStorage 记忆）
2. **01 CAREER 公司经历**：叙事线"传统技术工程师 → 部门 AI 提效负责人"（按你的建议），垂直时间线（2017–2021 中南林科大·汽车服务工程 → 2021 至今 道通科技）；6 个项目条目（EV Kit 2 高压测量、翻译 Agent、资料治理知识库、四轮定位标定、VIN 车型识别、TPMS/IM/BT608 支撑），左边框灰线悬停变红的 Guide-Line 列表；数字计数条（几十个品牌 / 3 类 Agent 工具等）；链接到 Q-profile 站
3. **02 GAMES 游戏开发**：双大卡网格 —— 《剑士》(Godot 4.7：21 角色/70 武器/102 道具/20 波) 与 嘟嘟羽毛球 (Cocos 3.8.8：20 关/7 技能/39 皮肤)；复用各项目 webp 截图与图标；点击进入详情浮层
4. **03 MOBILE 移动端**：QNote (Flutter：小Q 智能体/14 工具/9 技能/本地优先) 与 Q 菜单 (微信小程序原生 + 云开发：群组点菜/20 人/订阅消息)
5. **PROJECT INDEX 项目索引**：5 个项目全宽行式列表（编号、类别标签、名称、技术栈、年份、→ 在线/源码链接），纯排版、灰线悬停变红——本站瑞士味最浓的板块
6. **CONTACT 页脚**：黑底白字大字排版，"Never idle." 标语，邮箱 favoro@qq.com / 电话，GitHub 链接

**项目详情浮层**：点击项目从底部滑入全屏 overlay（grid 布局：大图 + 角色定位/技术亮点/成果 + 试玩/源码按钮），ESC/点击关闭，body 滚动锁定。内容取自各项目 `data.js` 与已抓取文案。

## 素材准备
- 复制复用：huang-web 头像 avatar.jpg；剑士 shot_*.webp + app_icon.png；嘟嘟 court 图 + app-icon.png；QNote app_icon.png；Qmenu logo.svg
- media-gen 生成（在 Godot 仓库内运行脚本、以绝对路径 `-o` 输出到本站，完成后不改游戏仓库）：
  - 海报图 ×2–3 张备选：提示词"瑞士国际主义几何构成海报，红黑白，网格、圆与对角线，无文字"，Pillow 裁剪为 16:9/竖版，转 WebP
  - BGM ×2 备选：极简、克制、电子氛围，instrumental；ffmpeg 截取 ~60s、afade 首尾、64k 单声道 mp3
- 视频不搬运（promo.mp4 太大），浮层内嵌各项目在线站链接

## 风格纪律（严格执行提示词规则）
- 仅 `#000 / #fff / #ff0000 / #0057b8`；`rounded-none`、零阴影、零渐变；12 列网格 + 发丝分隔线；文字左对齐；大留白
- 悬停：只允许颜色/边框变化 + 按钮箭头 `translate-x`；`transition ... 150ms ease-out`
- 入场动画：文字遮罩上推、网格线 scaleX 绘制、图片 clip-path 擦除、数字计数——每板块一次，克制不弹跳；`prefers-reduced-motion` 全部降级为 fade/无动画
- 交付前对照自检清单逐项过（禁止 font-serif/rounded-lg/shadow/渐变/italic 等）

## 移动端适配
- 断点 640/1024；单列堆叠、浮层全屏、标题阶梯缩至 `clamp()` 尺寸；导航折叠为全屏网格菜单；触控目标 ≥44px；无横向溢出

## 实施步骤
1. 在 `01-个人网站` 脚手架 Vite (vanilla-ts)，建目录结构、token CSS、数据文件 `src/data/projects.ts`
2. 生成 AI 海报图与 BGM，整理复制静态素材到 `public/`
3. 实现 Hero + 导航 + 滚动入场系统
4. 实现 01 CAREER 板块（叙事 + 时间线 + 6 项目列表 + 数字条）
5. 实现 02/03 项目卡网格 + 详情浮层
6. 实现 PROJECT INDEX + CONTACT 页脚
7. 移动端适配打磨 + 可访问性（焦点态、对比度、aria、reduced-motion）
8. 本地 `npm run build` + 浏览器多视口验证（browser-use 截图检查 Swiss 风格一致性与溢出）
9. `git init` → 推送到 `https://github.com/favoroo/Huangqian.git`（main 分支）→ 提交 `.github/workflows/deploy.yml` → 用 `gh api` 启用 Pages（source: github-actions）→ 验证 `https://favoroo.github.io/Huangqian/` 可访问

## 需要确认/假设
- 假设 Huangqian 仓库已存在或可用 `gh repo create` 创建；推送需本机 git 凭据已配置 favoroo 账号
- 电话/邮箱直接展示（沿用 Q-profile 公开信息）