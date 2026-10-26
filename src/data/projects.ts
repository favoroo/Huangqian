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
];

export const contact = {
  email: 'favoro@qq.com',
  github: 'https://github.com/favoroo',
  profile: 'https://favoroo.github.io/Q-profile/',
};
