import './styles/main.css';
import { works, reels, type Work, type Reel } from './data/projects';
import { DitherVeil } from './lib/DitherVeil';

const base = import.meta.env.BASE_URL;
const imgRaw = (name: string) => `${base}img/${name}`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

/* ---------- 作品卡渲染 ---------- */

/** 有宣传片的项目：封面 + 播放键，点开带声音播放 */
function videoWorkHTML(w: Work, modClass = ''): string {
  const promo = w.promo!;
  const sources = promo.sources.map((s) => `<source src="${s.src}" type="${s.type}" />`).join('');
  return `
  <article class="work ${modClass} reveal" data-work="${w.id}">
    <div class="work__video" data-video-wrap style="--video-aspect: ${promo.aspect}">
      <video preload="none" playsinline poster="${promo.poster}" aria-label="${w.name}演示视频">
        ${sources}
      </video>
      <button class="work__play" data-video-play aria-label="播放${w.name}演示视频">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.8v16.4c0 .9 1 1.5 1.8 1L21.4 13a1.2 1.2 0 0 0 0-2L7.8 2.9C7 2.4 6 2.9 6 3.8z"/></svg>
      </button>
    </div>
    <div class="work__caption">
      <img class="work__icon" src="${imgRaw(w.icon)}" alt="" width="56" height="56" />
      <div class="work__meta">
        <h3 class="work__name">${w.name}</h3>
        <p class="work__line">${w.line}</p>
      </div>
      <a class="work__go" href="${w.url}" target="_blank" rel="noopener">访问站点 <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

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
  // 按「游戏 / 应用」分成两段，各自内部保持原有的大卡 / 紧凑卡排布
  const groups: { kind: Work['kind']; label: string }[] = [
    { kind: 'game', label: '游戏' },
    { kind: 'app', label: '应用' },
  ];
  grid.innerHTML = groups
    .map(({ kind, label }) => {
      const items = works.filter((w) => w.kind === kind);
      if (!items.length) return '';
      return `
    <div class="works__group works__group--${kind}">
      <p class="works__label reveal">${label}</p>
      <div class="works__items">
        ${items.map((w) => (w.promo ? videoWorkHTML(w, `work--${w.id}`) : compactHTML(w))).join('')}
      </div>
    </div>`;
    })
    .join('');
})();

/* ---------- 宣传片：点击播放（带声音），滚出暂停 ---------- */

(function promoVideos() {
  document.querySelectorAll<HTMLElement>('[data-video-wrap]').forEach((wrap) => {
    const video = wrap.querySelector('video');
    const playBtn = wrap.querySelector<HTMLButtonElement>('[data-video-play]');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => {
      video.controls = true;
      wrap.classList.add('is-playing');
      void video.play();
    });

    // 播放结束：回到封面态
    video.addEventListener('ended', () => {
      video.controls = false;
      wrap.classList.remove('is-playing');
      video.load();
    });

    // 滚出视口自动暂停
    new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      },
      { threshold: 0.1 },
    ).observe(wrap);
  });
})();

/* ---------- 职业经历：录屏窗口 + 弹窗播放 ---------- */

function reelHTML(r: Reel, i: number): string {
  const first = r.clips[0];
  const poster = `${base}img/${first.poster}`;
  return `
  <button class="reel reveal" style="--rd:${120 + i * 90}ms" data-reel="${r.id}" aria-label="播放「${r.name}」录屏">
    <span class="reel__chrome">
      <span class="reel__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="reel__time">${first.duration}</span>
    </span>
    <span class="reel__frame">
      <video muted loop playsinline preload="none" data-preview="${base}${first.src}" aria-hidden="true"></video>
      <img class="reel__poster" src="${poster}" alt="" loading="lazy" decoding="async" />
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

(function careerReels() {
  const row = $('#reelsRow');
  const dialog = $('#lightbox') as HTMLDialogElement;
  const video = $('#lightboxVideo') as HTMLVideoElement;
  const title = $('#lightboxTitle');
  const tabs = $('#lightboxTabs');
  const closeBtn = $('#lightboxClose') as HTMLButtonElement;
  if (!row) return;

  row.innerHTML = reels.map(reelHTML).join('');
  if (!dialog || !video || !tabs) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 悬停静音预览：首次悬停才加载，移开暂停并退回封面
  if (!reduced) {
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
    video.poster = `${base}img/${clip.poster}`;
    // 先让浏览器把媒体拉起来再播：readyState 不足时直接 play() 会被省电策略中断（AbortError）
    video.src = `${base}${clip.src}`;
    video.load();
    const start = () => void video.play().catch(() => {});
    if (video.readyState >= 3) start();
    else video.addEventListener('canplay', start, { once: true });
  };

  const open = (id: string) => {
    const r = reels.find((x) => x.id === id);
    if (!r) return;
    active = r;
    current = row.querySelector<HTMLElement>(`[data-reel="${id}"]`);
    current?.querySelector('video')?.pause();
    title!.textContent = `${r.name} — ${r.line}`;

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

    dialog.showModal();
    playClip(0);
  };

  // 幂等收尾：无论走按钮、遮罩、Esc 还是原生 dialog 关闭，都能安全重复执行
  const cleanup = () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  };

  const close = () => {
    if (!dialog.open) return;
    dialog.close();
    cleanup();
    current?.focus();
  };

  row.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-reel]');
    if (card) open(card.dataset.reel!);
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
