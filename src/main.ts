import './styles/main.css';
import { works, reels, games, type Work, type Reel, type GameReel } from './data/projects';
import { DitherVeil } from './lib/DitherVeil';

const base = import.meta.env.BASE_URL;
const imgRaw = (name: string) => `${base}img/${name}`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

/** 数据里的媒体地址：外部完整 URL 原样用，其余按 public 下相对路径拼 */
const mediaURL = (u: string) => (u.startsWith('http') ? u : `${base}${u}`);

/* ---------- 作品卡渲染 ---------- */

function compactHTML(w: Work): string {
  return `
  <a class="card card--compact reveal" href="${w.url}" target="_blank" rel="noopener" aria-label="访问 ${w.name} 站点">
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
      <div class="works__items">${works.map((w) => compactHTML(w)).join('')}</div>
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
      <video muted loop playsinline preload="none" data-preview="${mediaURL(first.src)}" aria-hidden="true"></video>
      <img class="reel__poster" src="${mediaURL(first.poster.startsWith('http') ? first.poster : `img/${first.poster}`)}" alt="" loading="lazy" decoding="async" />
      <span class="reel__play" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M6 3.8v16.4c0 .9 1 1.5 1.8 1L21.4 13a1.2 1.2 0 0 0 0-2L7.8 2.9C7 2.4 6 2.9 6 3.8z"/></svg>
      </span>
    </span>
    <span class="reel__caption">
      <span class="reel__name">${r.name}</span>
      <span class="reel__line">${r.line}</span>
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

  // 悬停静音预览：首次悬停才加载，移开暂停并退回封面
  if (!reduced) {
    [careerRow, gamesRow].forEach((row) => {
      row.querySelectorAll<HTMLElement>('.reel').forEach((card) => {
        const v = card.querySelector('video');
        if (!v) return;
        card.addEventListener('pointerenter', (e) => {
          if (e.pointerType !== 'mouse') return;
          if (!v.src) v.src = v.dataset.preview!;
          void v.play().catch(() => {});
          card.classList.add('is-previewing');
        });
        card.addEventListener('pointerleave', () => {
          v.pause();
          card.classList.remove('is-previewing');
        });
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
    video.poster = mediaURL(clip.poster.startsWith('http') ? clip.poster : `img/${clip.poster}`);
    // 先让浏览器把媒体拉起来再播：readyState 不足时直接 play() 会被省电策略中断（AbortError）
    video.src = mediaURL(clip.src);
    video.load();
    // 舞台按本段视频的宽高比自适应（录屏 2:1，游戏宣传片 16:9 / 20:9）
    stage?.style.setProperty('--lb-aspect', clip.aspect ?? '');
    const start = () => void video.play().catch(() => {});
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
  menuEl.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
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
  const mark = (el: Element) => {
    if (shown.has(el)) return;
    shown.add(el);
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
  requestAnimationFrame(sweep);
  setTimeout(sweep, 600);
  // belt & braces: some embedded webviews never deliver IO callbacks;
  // a passive scroll sweep keeps the page correct everywhere.
  addEventListener('scroll', sweep, { passive: true });
})();
