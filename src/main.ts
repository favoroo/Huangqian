import './styles/main.css';
import { careerItems, projects, careerProject, type ProjectDetail } from './data/projects';

const base = import.meta.env.BASE_URL;
const img = (name: string) => `${base}img/${name}.webp`;
const imgRaw = (name: string) => `${base}img/${name}`;

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

/* ---------- ticker ---------- */
(function ticker() {
  const items = [
    '汽车技术工程师',
    'AI 提效',
    'Godot 游戏开发',
    'Cocos Creator',
    'Flutter',
    '微信小程序',
    '独立开发',
    'Never idle',
  ];
  const unit = items
    .map((t) => `<span>${t}<em>&nbsp;/&nbsp;</em></span>`)
    .join('');
  $('#tickerTrack').innerHTML = unit + unit;
})();

/* ---------- career list ---------- */
(function careerList() {
  $('#careerList').innerHTML = careerItems
    .map(
      (it) => `
      <button class="career__item" data-career="${it.no}" aria-label="查看 ${it.name} 详情">
        <span class="career__no label">${it.no}</span>
        <span class="career__name">${it.name}</span>
        <span class="career__role">${it.role}</span>
        <span class="career__open" aria-hidden="true">→</span>
      </button>`,
    )
    .join('');
  document.querySelectorAll<HTMLButtonElement>('.career__item').forEach((btn) => {
    btn.addEventListener('click', () => openOverlay(careerProject));
  });
})();

/* ---------- project cards ---------- */
function cardHTML(p: ProjectDetail, iconMedia?: { src: string; alt: string }) {
  const media = iconMedia
    ? `<div class="card__media">
         <img src="${iconMedia.src}" alt="${iconMedia.alt}" width="128" height="128" loading="lazy">
         <span class="card__badge label"><em>${p.no}</em>&nbsp;&nbsp;${p.categoryEn}</span>
       </div>`
    : `<div class="card__media">
         <img src="${img(p.gallery[0]?.src ?? '')}" alt="${p.title} 截图" loading="lazy">
         <span class="card__badge label"><em>${p.no}</em>&nbsp;&nbsp;${p.categoryEn}</span>
       </div>`;
  return `
    <button class="card${iconMedia ? ' card--icon' : ''}" data-id="${p.id}" aria-label="查看 ${p.title} 详情">
      ${media}
      <span class="card__body">
        <span class="card__title">${p.title}<small>${p.titleEn}</small></span>
        <span class="card__tag">${p.tagline}</span>
        <span class="card__desc">${p.description}</span>
        <span class="card__foot">
          <span class="card__stack label">${p.stack.join(' / ')}</span>
          <span class="card__cta">详情 <span class="arrow" aria-hidden="true">→</span></span>
        </span>
      </span>
    </button>`;
}

const [swordsman, dudu, qnote, qmenu] = projects;
$('#gameCards').innerHTML = [swordsman, dudu].map((p) => cardHTML(p)).join('');
$('#mobileCards').innerHTML = `
  ${cardHTML(qnote, { src: imgRaw('qnote-icon.png'), alt: 'QNote 应用图标' })}
  ${cardHTML(qmenu, { src: imgRaw('qmenu-logo.svg'), alt: 'Q 菜单 logo' })}`;

/* ---------- project index ---------- */
const indexData = [
  { p: careerProject, year: '2021—', stack: '汽车工程 / AI Agent / 数据开发' },
  { p: swordsman, year: '2025—', stack: 'Godot 4.7 · GDScript' },
  { p: dudu, year: '2025—', stack: 'Cocos Creator 3.8 · TypeScript' },
  { p: qnote, year: '2025—', stack: 'Flutter / Dart · Riverpod' },
  { p: qmenu, year: '2026', stack: '微信小程序原生 · 云开发' },
];
$('#indexList').innerHTML = indexData
  .map(
    ({ p, year, stack }, i) => `
    <button class="index__row" data-id="${p.id}" aria-label="查看 ${p.title} 详情">
      <span class="index__no label">${String(i + 1).padStart(2, '0')}</span>
      <span class="index__name">${p.title}<small>${p.titleEn}</small></span>
      <span class="index__stack">${stack}</span>
      <span class="index__year label">${year}</span>
      <span class="index__go" aria-hidden="true">→</span>
    </button>`,
  )
  .join('');

/* ---------- overlay ---------- */
const overlay = $('#overlay');
const overlayPanel = $('#overlayPanel');
const overlayBody = $('#overlayBody');
const overlayCrumb = $('#overlayCrumb');
let lastFocus: HTMLElement | null = null;

function overlayHTML(p: ProjectDetail): string {
  const stats = p.stats
    .map(
      (s) => `<div>
        <p class="stats__num"><span>${s.value}</span>${s.suffix ? `<em>${s.suffix}</em>` : ''}</p>
        <p class="stats__label label">${s.label}</p>
      </div>`,
    )
    .join('');
  const highlights = p.highlights
    .map(
      (h, i) => `<li>
        <span class="label">${String(i + 1).padStart(2, '0')}</span><span>${h}</span>
      </li>`,
    )
    .join('');
  const gallery = p.gallery.length
    ? `<div class="ov-gallery">${p.gallery
        .map(
          (g) => `<figure>
            <img src="${img(g.src)}" alt="${g.caption}" loading="lazy">
            <figcaption>${g.caption}</figcaption>
          </figure>`,
        )
        .join('')}</div>`
    : '';
  const links = p.links
    .map(
      (l, i) =>
        `<a class="btn${i ? ' btn--ghost' : ''}" href="${l.url}" target="_blank" rel="noopener">${l.label} <span class="arrow" aria-hidden="true">→</span></a>`,
    )
    .join('');
  return `
    <header class="ov-head">
      <p class="ov-eyebrow label"><span class="red">${p.no}</span><span>${p.categoryEn}</span></p>
      <h3 class="ov-title">${p.title}<small>${p.titleEn}</small></h3>
      <p class="ov-tag">${p.tagline.replace('，', '<em>，</em>')}</p>
      <p class="ov-desc">${p.description}</p>
      <ul class="ov-stack" style="margin-top:18px">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
    </header>
    <aside class="ov-side">
      <div class="stats" style="--cols:2">${stats}</div>
      <div class="ov-links">${links}</div>
    </aside>
    <section class="ov-highlights">
      <p class="label" style="color:var(--c-gray)">KEY POINTS / 亮点</p>
      <ol>${highlights}</ol>
    </section>
    ${gallery}`;
}

function openOverlay(p: ProjectDetail) {
  lastFocus = document.activeElement as HTMLElement;
  overlayCrumb.textContent = `${p.no} — ${p.title} / ${p.titleEn}`;
  overlayBody.innerHTML = overlayHTML(p);
  overlay.dataset.open = 'true';
  document.body.dataset.overlayOpen = 'true';
  requestAnimationFrame(() => {
    overlay.dataset.visible = 'true';
    overlayPanel.scrollTop = 0;
    $('#overlayClose').focus();
  });
}

function closeOverlay() {
  if (overlay.dataset.open !== 'true') return;
  overlay.dataset.visible = 'false';
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    overlay.removeEventListener('transitionend', finish);
    overlay.dataset.open = 'false';
    delete document.body.dataset.overlayOpen;
    lastFocus?.focus();
  };
  overlay.addEventListener('transitionend', finish, { once: true });
  // transitionend is not guaranteed (interrupted/absent transitions), and a
  // stuck overlay would leave the page scroll-locked.
  setTimeout(finish, 500);
}

document
  .querySelectorAll<HTMLButtonElement>('.card[data-id], .index__row[data-id]')
  .forEach((btn) => {
    btn.addEventListener('click', () => {
      const p =
        btn.dataset.id === 'career'
          ? careerProject
          : projects.find((x) => x.id === btn.dataset.id);
      if (p) openOverlay(p);
    });
  });
$('#overlayClose').addEventListener('click', closeOverlay);
$('#overlayScrim').addEventListener('click', closeOverlay);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.dataset.open === 'true') closeOverlay();
});

/* ---------- mobile menu ---------- */
const menu = $('#menu');
const burger = $('#burger');

function setMenu(open: boolean) {
  document.body.dataset.menuOpen = String(open);
  menu.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  if (open) menu.querySelector<HTMLElement>('.menu__item')?.focus();
}
burger.addEventListener('click', () => setMenu(document.body.dataset.menuOpen !== 'true'));
$('#menuClose').addEventListener('click', () => setMenu(false));
document.querySelectorAll('.menu__item').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.dataset.menuOpen === 'true') setMenu(false);
});

/* ---------- reveal on scroll ---------- */
(function reveals() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll('.reveal, .reveal-line, .reveal-rule, .reveal-clip')];
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
      for (const en of entries) {
        if (en.isIntersecting) {
          mark(en.target);
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px -4% 0px' },
  );
  targets.forEach((t) => io.observe(t));
  // first-paint correctness: anything already inside the viewport reveals now,
  // so above-the-fold content never waits for an observer callback.
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

/* ---------- stat count-up ---------- */
(function counters() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-count]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const done = new WeakSet<HTMLElement>();
  const run = (el: HTMLElement) => {
    if (done.has(el)) return;
    done.add(el);
    const target = Number(el.dataset.count);
    if (reduced) {
      el.textContent = String(target);
      return;
    }
    const dur = 900;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          run(en.target as HTMLElement);
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.5 },
  );
  els.forEach((el) => io.observe(el));
  // fallback for webviews that never deliver IO callbacks
  const sweep = () => {
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.9 && r.bottom > 0) run(el);
    }
  };
  addEventListener('scroll', sweep, { passive: true });
  requestAnimationFrame(sweep);
})();

/* ---------- BGM toggle ---------- */
(function bgm() {
  const audio = $('#bgm') as unknown as HTMLAudioElement;
  const btn = $('#bgmToggle');
  const KEY = 'hq-bgm';
  const slash = btn.querySelector('.bgm-off') as SVGPathElement;
  let on = localStorage.getItem(KEY) === '1';

  const apply = () => {
    btn.setAttribute('aria-pressed', String(on));
    slash.style.display = on ? 'none' : '';
  };

  const start = () => {
    audio.volume = 0.35;
    audio.play().catch(() => {});
  };

  apply();
  btn.addEventListener('click', () => {
    on = !on;
    localStorage.setItem(KEY, on ? '1' : '0');
    apply();
    if (on) start();
    else audio.pause();
  });

  // resume preference on first user gesture (autoplay policy)
  const resume = () => {
    if (on) start();
    document.removeEventListener('pointerdown', resume);
  };
  document.addEventListener('pointerdown', resume);
})();
