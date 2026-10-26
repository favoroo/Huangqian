import './styles/main.css';
import { works, swordsmanVideo, type Work } from './data/projects';
import { DitherVeil } from './lib/DitherVeil';

const base = import.meta.env.BASE_URL;
const imgRaw = (name: string) => `${base}img/${name}`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

/* ---------- 作品卡渲染 ---------- */

function featuredHTML(w: Work): string {
  const sources = swordsmanVideo.sources.map((s) => `<source src="${s.src}" type="${s.type}" />`).join('');
  return `
  <article class="work work--featured reveal">
    <div class="work__video" id="promoWrap">
      <video id="promoVideo" preload="none" playsinline poster="${swordsmanVideo.poster}" aria-label="剑士游戏演示视频">
        ${sources}
      </video>
      <button class="work__play" id="promoPlay" aria-label="播放剑士演示视频">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.8v16.4c0 .9 1 1.5 1.8 1L21.4 13a1.2 1.2 0 0 0 0-2L7.8 2.9C7 2.4 6 2.9 6 3.8z"/></svg>
      </button>
    </div>
    <div class="work__caption">
      <h3 class="work__name">${w.name}</h3>
      <p class="work__line">${w.line}</p>
      <a class="work__go" href="${w.url}" target="_blank" rel="noopener">访问站点 <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

function cardHTML(w: Work, extraClass = ''): string {
  return `
  <a class="card reveal ${extraClass}" href="${w.url}" target="_blank" rel="noopener" aria-label="访问 ${w.name} 站点">
    <div class="card__media"><img src="${imgRaw(w.media)}" alt="${w.mediaAlt}" loading="lazy" /></div>
    <div class="card__body">
      <h3 class="card__name">${w.name}</h3>
      <p class="card__line">${w.line}</p>
      <span class="card__arrow" aria-hidden="true">→</span>
    </div>
  </a>`;
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
  const [featured, dudu, ...rest] = works;
  grid.innerHTML = `
    ${featuredHTML(featured)}
    ${cardHTML(dudu, 'work--dudu')}
    <div class="works__rail">
      ${rest.map((w) => compactHTML(w)).join('')}
    </div>`;
})();

/* ---------- 剑士视频：点击播放（带声音），滚出暂停 ---------- */

(function promoVideo() {
  const wrap = $('#promoWrap');
  const video = document.querySelector('#promoVideo') as HTMLVideoElement;
  const playBtn = $('#promoPlay') as HTMLButtonElement;
  if (!wrap || !video || !playBtn) return;

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
})();

/* ---------- DitherVeil 首屏面纱 ---------- */

(function veil() {
  const host = $('#veil');
  if (!host) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    new DitherVeil(host, {
      src: `${base}img/avatar.jpg`,
      fit: 'cover',
      pattern: 'floyd',
      pixelSize: 2,
      inkColor: '#0a0a0a',
      paperColor: '#eae6dd',
      rimColor: '#e0342b',
      rim: 0.3,
      contrast: 1.2,
      revealRadius: 180,
      softness: 0.6,
      linger: 1.2,
      wander: !reduced,
      clickBurst: !reduced,
    });
  } catch {
    // WebGL 不可用：退回静态头像
    host.innerHTML = `<img src="${base}img/avatar.jpg" alt="黄谦的肖像" />`;
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
