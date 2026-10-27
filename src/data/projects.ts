// 作品集数据 —— 极简模型：名称 + 一行类别 + 媒体 + 外链。
// 想看细节的人会点进各项目站点，本站只负责好看。

export interface Work {
  id: string;
  name: string;
  nameEn: string;
  /** 一句话类别说明 */
  line: string;
  /** 图标或截图（public/img 下的文件名，含扩展名） */
  media: string;
  mediaAlt: string;
  /** 名称左侧的小图标 */
  icon: string;
  /** 在线站点 */
  url: string;
}

/** 应用作品；游戏宣传窗口单独放在 games */
export const works: Work[] = [
  {
    id: 'qnote',
    name: 'QNote',
    nameEn: 'QNOTE',
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
    line: '智能幻灯片编辑器',
    media: 'qian-ppt-icon.svg',
    mediaAlt: 'Qian-PPT 图标',
    icon: 'qian-ppt-icon.svg',
    url: 'https://favoroo.github.io/qian-ppt/',
  },
];

/** 职业经历下的录屏窗口 —— 部门 AI 提效的实际产物 */
export interface ReelClip {
  /** 分段标题，同一窗口有多段录屏时作为切换标签 */
  label: string;
  /** 时长，显示在窗口标题栏 */
  duration: string;
  /** 弹窗舞台宽高比；缺省按录屏画面 1918 / 952 */
  aspect?: string;
  /** 封面帧：public/img 下的文件名，或外部完整 URL */
  poster: string;
  /** public 下的相对路径（本地 H.264 副本），或外部完整 URL */
  src: string;
}

export interface Reel {
  id: string;
  name: string;
  /** 一句话说明 */
  line: string;
  /** 名称旁的小图标（public/img 下的文件名）；游戏宣传窗使用 */
  icon?: string;
  /** 一扇窗口可放多段录屏；卡片封面取第一段 */
  clips: ReelClip[];
}

export const reels: Reel[] = [
  {
    id: 'evkit',
    name: '图片批量处理工具',
    line: '零件照片一键转线稿',
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
    name: '维修资料问答助手',
    line: '维修问题直接问，答案带手册出处',
    clips: [
      {
        label: '手册问答',
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
    name: '文档批量翻译平台',
    line: '术语表自动检查与翻译',
    clips: [
      {
        label: '批量翻译',
        duration: '01:50',
        poster: 'career-trans-agent.webp',
        src: 'videos/trans-agent.mp4',
      },
    ],
  },
];

/** 游戏宣传窗口 —— 与录屏窗口共用一套弹窗播放；视频热链各项目官网，那边更新这里自动同步 */
export interface GameReel extends Reel {
  /** 游戏官网 */
  url: string;
}

export const games: GameReel[] = [
  {
    id: 'swordsman',
    name: '剑士',
    line: 'Godot 动作肉鸽游戏',
    icon: 'swordsman-icon.png',
    url: 'https://favoroo.github.io/Q-xiuxian/site/',
    clips: [
      {
        label: '宣传片',
        duration: '00:59',
        aspect: '16 / 9',
        poster: 'https://favoroo.github.io/Q-xiuxian/site/img/shot_field.webp',
        src: 'https://favoroo.github.io/Q-xiuxian/site/video/promo.mp4',
      },
    ],
  },
  {
    id: 'dudu',
    name: '嘟嘟羽毛球',
    line: 'Cocos 休闲竞技游戏',
    icon: 'dudu-icon.png',
    url: 'https://favoroo.github.io/Dudu-Badminton/site/',
    clips: [
      {
        label: '宣传片',
        duration: '00:16',
        aspect: '20 / 9',
        poster: 'https://favoroo.github.io/Dudu-Badminton/site/img/poster.webp',
        src: 'https://favoroo.github.io/Dudu-Badminton/site/video/promo.mp4',
      },
    ],
  },
];

export const contact = {
  email: 'favoro@qq.com',
  github: 'https://github.com/favoroo',
  profile: 'https://favoroo.github.io/Q-profile/',
};
