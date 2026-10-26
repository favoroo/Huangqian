// 作品集数据 —— 极简模型：名称 + 一行类别 + 媒体 + 外链。
// 想看细节的人会点进各项目站点，本站只负责好看。

/** 项目宣传片 —— 热链各项目官网，那边更新这里自动同步 */
export interface Promo {
  sources: { src: string; type: string }[];
  poster: string;
  /** 视频宽高比，用于预留版面 */
  aspect: string;
}

export interface Work {
  id: string;
  name: string;
  nameEn: string;
  /** 分组：游戏 / 应用 */
  kind: 'game' | 'app';
  /** 一句话类别说明 */
  line: string;
  /** 图标或截图（public/img 下的文件名，含扩展名） */
  media: string;
  mediaAlt: string;
  /** 名称左侧的小图标 */
  icon: string;
  /** 在线站点 */
  url: string;
  /** 有宣传片的项目用视频卡替换静态图 */
  promo?: Promo;
}

export const works: Work[] = [
  {
    id: 'swordsman',
    name: '剑士',
    nameEn: 'SWORDSMAN',
    kind: 'game',
    line: 'Godot 动作肉鸽游戏',
    media: 'swordsman-icon.png',
    mediaAlt: '剑士游戏图标',
    icon: 'swordsman-icon.png',
    url: 'https://favoroo.github.io/Q-xiuxian/site/',
    promo: {
      sources: [
        { src: 'https://favoroo.github.io/Q-xiuxian/site/video/promo.av1.mp4', type: 'video/mp4; codecs="av01"' },
        { src: 'https://favoroo.github.io/Q-xiuxian/site/video/promo.mp4', type: 'video/mp4' },
      ],
      poster: 'https://favoroo.github.io/Q-xiuxian/site/img/shot_field.webp',
      aspect: '16 / 9',
    },
  },
  {
    id: 'dudu',
    name: '嘟嘟羽毛球',
    nameEn: 'DUDU BADMINTON',
    kind: 'game',
    line: 'Cocos 休闲竞技游戏',
    media: 'dudu-arena.webp',
    mediaAlt: '嘟嘟羽毛球游戏画面',
    icon: 'dudu-icon.png',
    url: 'https://favoroo.github.io/Dudu-Badminton/site/',
    promo: {
      sources: [{ src: 'https://favoroo.github.io/Dudu-Badminton/site/video/promo.mp4', type: 'video/mp4' }],
      poster: 'https://favoroo.github.io/Dudu-Badminton/site/img/poster.webp',
      aspect: '20 / 9',
    },
  },
  {
    id: 'qnote',
    name: 'QNote',
    nameEn: 'QNOTE',
    kind: 'app',
    line: 'Flutter 笔记应用',
    media: 'qnote-icon.png',
    mediaAlt: 'QNote 应用图标',
    icon: 'qnote-icon.png',
    url: 'https://favoroo.github.io/QNote/',
  },
  {
    id: 'qmenu',
    name: 'Q 菜单',
    nameEn: 'QMENU',
    kind: 'app',
    line: '微信小程序',
    media: 'qmenu-logo.svg',
    mediaAlt: 'Q 菜单 logo',
    icon: 'qmenu-logo.svg',
    url: 'https://favoroo.github.io/Qmenu/',
  },
  {
    id: 'qian-ppt',
    name: 'Qian-PPT',
    nameEn: 'QIAN-PPT',
    kind: 'app',
    line: '智能幻灯片编辑器',
    media: 'qian-ppt-icon.svg',
    mediaAlt: 'Qian-PPT 图标',
    icon: 'qian-ppt-icon.svg',
    url: 'https://github.com/favoroo/qian-ppt',
  },
];

/** 职业经历下的录屏窗口 —— 部门 AI 提效的实际产物 */
export interface ReelClip {
  /** 分段标题，同一窗口有多段录屏时作为切换标签 */
  label: string;
  /** 时长，显示在窗口标题栏 */
  duration: string;
  /** 封面帧（public/img 下的文件名） */
  poster: string;
  /** 本地 H.264 副本（public 下的相对路径），避免 HEVC 在 Chrome 里放不了 */
  src: string;
}

export interface Reel {
  id: string;
  name: string;
  /** 一句话说明 */
  line: string;
  /** 一扇窗口可放多段录屏；卡片封面取第一段 */
  clips: ReelClip[];
}

export const reels: Reel[] = [
  {
    id: 'evkit',
    name: 'EVBOX 图片处理工具',
    line: '零件图批量转线稿',
    clips: [
      {
        label: '批量转线稿',
        duration: '01:29',
        poster: 'career-evkit.webp',
        src: 'videos/evkit-imageproc.mp4',
      },
    ],
  },
  {
    id: 'docs',
    name: '汽车技术部资料 Agent',
    line: '维修手册问答，带出处',
    clips: [
      {
        label: '维修手册问答',
        duration: '00:45',
        poster: 'career-docs-agent.webp',
        src: 'videos/docs-agent.mp4',
      },
      {
        label: '知识库规模',
        duration: '00:47',
        poster: 'career-docs-agent-02.webp',
        src: 'videos/docs-agent-02.mp4',
      },
    ],
  },
  {
    id: 'trans',
    name: 'AUTEL 翻译 Agent 平台',
    line: 'Excel 术语整改与翻译',
    clips: [
      {
        label: '任务处理',
        duration: '01:50',
        poster: 'career-trans-agent.webp',
        src: 'videos/trans-agent.mp4',
      },
    ],
  },
];

export const contact = {
  email: 'favoro@qq.com',
  github: 'https://github.com/favoroo',
  profile: 'https://favoroo.github.io/Q-profile/',
};
