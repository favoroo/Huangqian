import './styles/main.css';
import { works, reels, games, type Work, type Reel, type GameReel } from './data/projects';
import { DitherVeil } from './lib/DitherVeil';
import { TechText } from './lib/TechText';

const base = import.meta.env.BASE_URL;
const imgRaw = (name: string) => `${base}img/${name}`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

/** 数据里的媒体地址：外部完整 URL 原样用，其余按 public 下相对路径拼 */
const mediaURL = (u: string) => (u.startsWith('http') ? u : `${base}${u}`);

/* ---------- 作品卡渲染 ---------- */

function compactHTML(w: Work, i: number): string {
  return `
  <a class="card card--compact reveal" style="--rd:${120 + i * 90}ms" href="${w.url}" target="_blank" rel="noopener" aria-label="访问 ${w.name} 站点">
    <img class="card__icon" src="${imgRaw(w.media)}" alt="${w.mediaAlt}" loading="lazy" />
    <div class="card__body">
      <h3 class="card__name">${w.name}</h3>
      <p class="card__line">${w.line}</p>
    </div>
    <span class="card__arrow" aria-hidden="true">→</span>
  </a>`;
}

(function renderWorks() {
  const grid = $('#worksGrid');
  // 游戏用小宣传窗并排（点开弹窗播放），应用保持紧凑卡一行
  grid.innerHTML = `
    <div class="works__group works__group--game">
      <p class="works__label reveal">游戏</p>
      <div class="games__row" id="gamesRow">${games.map((g, i) => gameHTML(g, i)).join('')}</div>
    </div>
    <div class="works__group works__group--app">
      <p class="works__label reveal">应用</p>
      <div class="works__items">${works.map((w, i) => compactHTML(w, i)).join('')}</div>
    </div>`;
})();

/* ---------- 职业经历：录屏窗口 + 弹窗播放 ---------- */

function reelHTML(r: Reel, i: number, { reveal = true }: { reveal?: boolean } = {}): string {
  const first = r.clips[0];
  return `
  <button class="reel${reveal ? ' reveal' : ''}"${reveal ? ` style="--rd:${120 + i * 90}ms"` : ''} data-reel="${r.id}" aria-label="播放「${r.name}」视频">
    <span class="reel__chrome">
      <span class="reel__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="reel__time">${first.duration}</span>
    </span>
    <span class="reel__frame">
      <video muted loop playsinline preload="none" data-preview="${mediaURL(first.previewSrc ?? first.src)}" aria-hidden="true"></video>
      <img class="reel__poster" src="${mediaURL(first.poster.startsWith('http') ? first.poster : `img/${first.poster}`)}" alt="" loading="lazy" decoding="async" />
      <span class="reel__play" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M6 3.8v16.4c0 .9 1 1.5 1.8 1L21.4 13a1.2 1.2 0 0 0 0-2L7.8 2.9C7 2.4 6 2.9 6 3.8z"/></svg>
      </span>
    </span>
    <span class="reel__caption${r.icon ? ' reel__caption--icon' : ''}">
      ${r.icon ? `<img class="reel__icon" src="${mediaURL(`img/${r.icon}`)}" alt="" width="44" height="44" loading="lazy" decoding="async" />` : ''}
      <span class="reel__caption__main">
        <span class="reel__name">${r.name}</span>
        <span class="reel__line">${r.line}</span>
      </span>
    </span>
  </button>`;
}

/** 游戏宣传窗：复用录屏卡外观；站点链接放卡外，button 里不能嵌链接 */
function gameHTML(g: GameReel, i: number): string {
  return `
  <div class="gamework reveal" style="--rd:${120 + i * 110}ms">
    ${reelHTML(g, i, { reveal: false })}
    <a class="gamework__site" href="${g.url}" target="_blank" rel="noopener">访问站点 <span class="arrow" aria-hidden="true">→</span></a>
  </div>`;
}

(function reelLightbox() {
  const careerRow = $('#reelsRow');
  const gamesRow = $('#gamesRow');
  const dialog = $('#lightbox') as HTMLDialogElement;
  const video = $('#lightboxVideo') as HTMLVideoElement;
  const stage = $('#lightboxStage');
  const title = $('#lightboxTitle');
  const tabs = $('#lightboxTabs');
  const closeBtn = $('#lightboxClose') as HTMLButtonElement;
  if (!careerRow || !gamesRow) return;

  careerRow.innerHTML = reels.map((r, i) => reelHTML(r, i)).join('');
  gamesRow.innerHTML = games.map((g, i) => gameHTML(g, i)).join('');
  if (!dialog || !video || !tabs) return;

  const findReel = (id: string) =>
    reels.find((x) => x.id === id) ?? games.find((x) => x.id === id);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 触摸设备没有 hover，没必要预下载
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 悬停静音预览：用独立的轻量微视频（每秒几 KB、20~60KB 全片），与弹窗里的完整原画分开。
  // 要点：
  // 1. 卡片进入视口就把整段微视频拉完（preload="auto"），悬停时几乎是本地文件，不再出现卡顿；
  // 2. 悬停防抖 80ms：鼠标快速划过整排卡不触发播放；
  // 3. 只在 playing 事件（真正解出画面）后才淡出封面，加载期绝不露黑；
  // 4. 移开即暂停并回到第 0 帧，下次悬停立刻可播。
  if (!reduced && canHover) {
    const cards: HTMLElement[] = [];
    [careerRow, gamesRow].forEach((row) => {
      row.querySelectorAll<HTMLElement>('.reel').forEach((card) => {
        cards.push(card);
      });
    });

    // 视口预取：微视频很小，直接下完整片
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target as HTMLElement;
              const v = card.querySelector('video');
              if (v && !v.src && v.dataset.preview) {
                v.preload = 'auto';
                v.src = v.dataset.preview;
                v.load();
              }
              obs.unobserve(card);
            }
          });
        },
        { rootMargin: '200px 0px' },
      );
      cards.forEach((c) => observer.observe(c));
    }

    cards.forEach((card) => {
      const v = card.querySelector('video');
      if (!v) return;

      let hoverTimer: number | null = null;
      let isHovered = false;

      // 只有真正起播并输出帧时才切走封面
      v.addEventListener('playing', () => {
        if (isHovered) card.classList.add('is-previewing');
      });
      // 缓冲中（极少出现）也不露黑：封面留着
      v.addEventListener('waiting', () => card.classList.remove('is-previewing'));

      card.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        isHovered = true;

        hoverTimer = window.setTimeout(() => {
          if (!isHovered) return;
          if (!v.src && v.dataset.preview) {
            v.preload = 'auto';
            v.src = v.dataset.preview;
            v.load();
          }
          void v.play().catch(() => {});
        }, 80);
      });

      card.addEventListener('pointerleave', () => {
        isHovered = false;
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        v.pause();
        // 回到片头，下次悬停从第一帧开始，也避免停在黑场帧
        v.currentTime = 0;
        card.classList.remove('is-previewing');
      });
    });
  }

  let current: HTMLElement | null = null;
  let active: Reel | null = null;

  /** 切换到某一分段：换 src 并从头播放 */
  const playClip = (index: number) => {
    if (!active) return;
    const clip = active.clips[index];
    if (!clip) return;
    tabs.querySelectorAll<HTMLButtonElement>('.lightbox__tab').forEach((t, i) => {
      t.classList.toggle('is-active', i === index);
      t.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    // 换片先淡到黑，canplay 后淡回：硬切变淡切，也盖住换源瞬间的闪黑
    stage?.classList.add('is-switching');
    video.poster = mediaURL(clip.poster.startsWith('http') ? clip.poster : `img/${clip.poster}`);
    // 弹窗是用户主动点击触发（已有用户手势交互），默认开启声音
    video.muted = false;
    // 先让浏览器把媒体拉起来再播：readyState 不足时直接 play() 会被省电策略中断（AbortError）
    video.src = mediaURL(clip.src);
    video.load();
    // 舞台按本段视频的宽高比自适应（录屏 2:1，游戏宣传片 16:9 / 20:9）
    stage?.style.setProperty('--lb-aspect', clip.aspect ?? '');
    const start = () => {
      stage?.classList.remove('is-switching');
      video.play().catch(() => {
        // 如果被某些严格策略阻止带声起播，降级为静音重试，保证视频能正常播
        video.muted = true;
        void video.play().catch(() => {});
      });
    };
    if (video.readyState >= 3) start();
    else video.addEventListener('canplay', start, { once: true });
  };

  const open = (id: string) => {
    const r = findReel(id);
    if (!r) return;
    active = r;
    current = document.querySelector<HTMLElement>(`[data-reel="${id}"]`);
    current?.querySelector('video')?.pause();
    title!.textContent = r.name;

    // 单段窗口不显示切换标签，避免多余的 UI
    if (r.clips.length > 1) {
      tabs.innerHTML = r.clips
        .map(
          (c, i) =>
            `<button class="lightbox__tab" type="button" data-clip="${i}">${c.label}<em>${c.duration}</em></button>`,
        )
        .join('');
      tabs.hidden = false;
      dialog.classList.add('has-tabs');
    } else {
      tabs.innerHTML = '';
      tabs.hidden = true;
      dialog.classList.remove('has-tabs');
    }

    // 关闭动画进行中再次点开：取消收尾，直接原地换片
    closeSeq++;
    dialog.classList.remove('is-closing');
    if (!dialog.open) dialog.showModal();
    playClip(0);
  };

  // 幂等收尾：无论走按钮、遮罩、Esc 还是原生 dialog 关闭，都能安全重复执行
  const cleanup = () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  };

  // 加载失败也要撤掉淡切黑屏，把错误态直接露出来
  video.addEventListener('error', () => stage?.classList.remove('is-switching'));

  // 关闭走一段快速淡出，动画结束后才真正 close()
  let closeSeq = 0;

  const close = () => {
    if (!dialog.open) return;
    current?.focus();
    if (reduced) {
      dialog.close();
      cleanup();
      return;
    }
    if (dialog.classList.contains('is-closing')) return;
    video.pause();
    dialog.classList.add('is-closing');
    const seq = ++closeSeq;
    const finish = () => {
      if (seq !== closeSeq) return; // 已被重新打开取消
      dialog.classList.remove('is-closing');
      if (dialog.open) dialog.close();
      cleanup();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === dialog) finish();
    };
    dialog.addEventListener('animationend', onEnd, { once: true });
    // 个别内嵌内核不派发 animationend，兜底定时器收口
    setTimeout(() => {
      dialog.removeEventListener('animationend', onEnd);
      finish();
    }, 280);
  };

  [careerRow, gamesRow].forEach((row) => {
    row.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-reel]');
      if (card) open(card.dataset.reel!);
    });
  });

  closeBtn?.addEventListener('click', close);

  // 分段切换：点标签换片，同一个弹窗里连续看
  tabs.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('.lightbox__tab');
    if (tab?.dataset.clip) playClip(Number(tab.dataset.clip));
  });

  // 点遮罩关闭（点在 dialog 自身而非内容上）
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // 浏览器原生 Esc 会直接 close() 而不经过上面的 close()；观察 open 属性比监听 close 事件更可靠
  new MutationObserver(() => {
    if (!dialog.open) cleanup();
  }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  // 自己处理 Esc：原生 cancel 在各端表现不一致，统一走同一条收尾路径
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) {
      e.preventDefault();
      close();
    }
  });
})();

/* ---------- 联系标题：TechText 工程图纸特效 ---------- */

(function contactTechText() {
  const host = $('#contactTech');
  if (!host) return;
  new TechText(host, {
    text: '欢迎联系。',
    fontWeight: 700,
    fontSize: 150,
    letterSpacing: 0,
    align: 'left',
    // 与 --red 一致（Canvas 读不到 CSS 变量）
    accentColor: '#e0342b',
    reveal: 'letter',
    dashLength: 4,
    dashGap: 2,
    specks: 15,
    intro: 'type',
    introDuration: 2,
    clickKick: true,
    guides: false,
  });
})();

/* ---------- DitherVeil 首屏面纱 ---------- */

(function veil() {
  const host = $('#veil');
  if (!host) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    // 完全复刻 React Bits 官方 demo 的参数组合
    new DitherVeil(host, {
      src: `${base}img/veil-photo.webp`,
      fit: 'contain',
      pattern: 'floyd',
      pixelSize: 2,
      inkColor: '#000000',
      paperColor: '#f4f1ea',
      revealRadius: 200,
      softness: 0.6,
      linger: 1,
      wander: !reduced,
      clickBurst: !reduced,
    });
  } catch {
    // WebGL 不可用：退回静态图
    host.innerHTML = `<img src="${base}img/veil-photo.webp" alt="" />`;
  }
})();

/* ---------- 移动端全屏菜单 ---------- */

(function menu() {
  const burger = $('#burger') as HTMLButtonElement;
  const menuEl = $('#menu');
  const close = $('#menuClose') as HTMLButtonElement;
  if (!burger || !menuEl || !close) return;

  const setMenu = (open: boolean) => {
    if (open) {
      document.body.dataset.menuOpen = '';
    } else {
      delete document.body.dataset.menuOpen;
    }
    menuEl.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    if (open) menuEl.querySelector('a')?.focus();
  };
  burger.addEventListener('click', () => setMenu(!document.body.hasAttribute('data-menu-open')));
  close.addEventListener('click', () => setMenu(false));
  // 菜单锚点不走原生 hash 跳转：iOS 会先瞬移到目标再平滑滚（闪一下）。
  // 改为两段式：先让菜单淡出（期间页面原地不动），淡出结束后再平滑滚向目标，
  // 滚动全程可见。scrollIntoView 不传 behavior，跟随 html 的 scroll-behavior
  // ——正常时平滑，prefers-reduced-motion 下自动变瞬时。
  let navSeq = 0;
  menuEl.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = a.hash ? document.querySelector<HTMLElement>(a.hash) : null;
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      const seq = ++navSeq;
      const go = () => {
        // 等待期间重开菜单或有更新的跳转，这次就不滚了
        if (seq !== navSeq || document.body.hasAttribute('data-menu-open')) return;
        target.scrollIntoView();
        if (location.hash !== a.hash) history.pushState(null, '', a.hash);
      };
      // 监听淡出结束再开滚；个别内嵌内核不派发 transitionend，定时器兜底
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        menuEl.removeEventListener('transitionend', onFadeEnd);
        go();
      };
      const onFadeEnd = (e: TransitionEvent) => {
        if (e.target === menuEl && e.propertyName === 'opacity') settle();
      };
      menuEl.addEventListener('transitionend', onFadeEnd);
      setTimeout(settle, 420); // --dur 350ms + 余量
    }),
  );
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.hasAttribute('data-menu-open')) setMenu(false);
  });
})();

/* ---------- 滚动入场（IO + sweep 双保险） ---------- */

(function reveals() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll('.reveal, .reveal-line, .reveal-rule')];
  if (reduced) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }
  const shown = new WeakSet<Element>();
  let remaining = targets.length;
  const mark = (el: Element) => {
    if (shown.has(el)) return;
    shown.add(el);
    remaining--;
    el.classList.add('is-in');
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) if (en.isIntersecting) {
        mark(en.target);
        io.unobserve(en.target);
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px -4% 0px' },
  );
  targets.forEach((t) => io.observe(t));
  const inView = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight * 0.96 && r.bottom > 0;
  };
  const sweep = () => targets.filter(inView).forEach(mark);

  // 背景超大编号的缓慢视差（±24px），与 sweep 共用同一条 rAF 节流的滚动通道
  const noSections = [...document.querySelectorAll<HTMLElement>('[data-no]')];
  const parallax = () => {
    for (const s of noSections) {
      const r = s.getBoundingClientRect();
      const vh = innerHeight;
      if (r.bottom < -80 || r.top > vh + 80) continue;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      s.style.setProperty('--no-shift', `${(-p * 24).toFixed(1)}px`);
    }
  };

  const frame = () => {
    sweep();
    parallax();
  };
  requestAnimationFrame(frame);
  setTimeout(sweep, 600);
  // belt & braces: some embedded webviews never deliver IO callbacks;
  // a passive scroll sweep keeps the page correct everywhere.
  // rAF 节流：每次滚动至多跑一帧；全部入场后 sweep 走空，只剩视差的 rect 读取
  let ticket = 0;
  const onScroll = () => {
    if (ticket) return;
    ticket = requestAnimationFrame(() => {
      ticket = 0;
      if (remaining > 0) sweep();
      parallax();
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
})();

/* ---------- 导航当前区块高亮（scroll-spy） ---------- */

(function spy() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav__link[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  let activeId: string | null = null;
  const setActive = (id: string | null) => {
    activeId = id;
    for (const l of links) l.classList.toggle('is-active', !!id && l.hash === `#${id}`);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        const id = (en.target as HTMLElement).id;
        if (en.isIntersecting) setActive(id);
        // 滚回首屏（hero 不参与高亮）时清掉残留的高亮
        else if (activeId === id) setActive(null);
      }
    },
    // 视口上中部一条窄带：穿过即视为「正在看这个区块」
    { rootMargin: '-35% 0px -60% 0px' },
  );
  for (const l of links) {
    const s = document.getElementById(l.hash.slice(1));
    if (s) io.observe(s);
  }
})();
