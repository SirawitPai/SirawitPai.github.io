/* =====================================================================
   Sirawit Boonthong — portfolio interactions
   ===================================================================== */
(() => {
  const body = document.body;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };
  const onVisible = (el, cb, opts = { threshold: 0.15 }) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } });
    }, opts);
    io.observe(el);
  };

  /* ---------- loader ---------- */
  window.addEventListener('load', () => setTimeout(() => body.classList.add('loaded'), 500));
  setTimeout(() => body.classList.add('loaded'), 4000); // safety net if a CDN stalls

  /* ---------- nav, menu, theme ---------- */
  const nav = document.querySelector('.nav-wrap');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const setMenu = (open) => { navLinks.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  const themeBtn = document.getElementById('themeBtn');
  const setTheme = (light) => {
    body.classList.toggle('light', light);
    themeBtn.innerHTML = light ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
    store.set('portfolio-theme', light ? 'light' : 'dark');
  };
  if (store.get('portfolio-theme') === 'light') setTheme(true);
  themeBtn.addEventListener('click', () => setTheme(!body.classList.contains('light')));

  /* ---------- word splitting for headline reveals ---------- */
  const segmenters = {};
  const segment = (text, lang) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      segmenters[lang] = segmenters[lang] || new Intl.Segmenter(lang, { granularity: 'word' });
      return [...segmenters[lang].segment(text)].map((s) => s.segment);
    }
    return text.split(/(\s+)/);
  };
  const splitWords = (el, lang, cls = 'wi') => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let i = 0;
    nodes.forEach((node) => {
      if (!node.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      segment(node.textContent, lang).forEach((part) => {
        if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
        const span = document.createElement('span');
        span.className = cls;
        span.style.setProperty('--i', i++);
        span.textContent = part;
        frag.appendChild(span);
      });
      node.replaceWith(frag);
    });
    return i;
  };

  /* ---------- i18n ---------- */
  const languageButton = document.getElementById('langBtn');
  const translations = window.I18N_TRANSLATIONS || {};
  const utils = window.PortfolioUtils;
  const experience = utils.experienceSince();
  const tokensFor = (lang) => ({ exp: utils.formatDuration(experience, lang), years: utils.roundedYears(experience) });
  const t = (key, lang = root.lang) => utils.fillTokens(utils.translate(translations, key, lang), tokensFor(lang));

  // experience numbers are calculated from Nov 2021 to Sep 2026 (see utils.js)
  document.querySelectorAll('[data-exp]').forEach((el) => {
    const value = el.dataset.exp === 'rounded' ? utils.roundedYears(experience) : experience[el.dataset.exp];
    el.dataset.count = value;
    el.textContent = value;
  });

  const applyLanguage = (language) => {
    const lang = language === 'th' ? 'th' : 'en';
    root.lang = lang;
    body.classList.toggle('lang-th', lang === 'th');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = translations[el.dataset.i18n]?.[lang];
      if (value !== undefined) el.innerHTML = utils.fillTokens(value, tokensFor(lang));
    });
    document.title = t('meta.title', lang) || document.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && t('meta.description', lang)) description.content = t('meta.description', lang);
    // the nav CV button downloads the CV in the language the page is shown in
    document.querySelectorAll('[data-cv-auto]').forEach((a) => {
      a.setAttribute('href', `assets/pdf/CV-SIRAWIT-${lang === 'th' ? 'TH' : 'EN'}.pdf`);
    });
    languageButton.textContent = lang === 'en' ? 'TH' : 'EN';
    languageButton.setAttribute('aria-label', lang === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English');
    languageButton.title = lang === 'en' ? 'ภาษาไทย' : 'English';
    store.set('portfolio-language', lang);
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
    document.querySelectorAll('[data-split]').forEach((el) => splitWords(el, lang));
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  };
  applyLanguage(store.get('portfolio-language') || 'en');
  languageButton.addEventListener('click', () => applyLanguage(root.lang === 'th' ? 'en' : 'th'));

  /* ---------- reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('.stagger').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--d', `${i * 110}ms`));
    onVisible(group, (g) => g.classList.add('visible'));
  });

  /* ---------- scroll: progress bar, nav state, active link ---------- */
  const progress = document.querySelector('.scroll-progress');
  const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navAnchors.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) sectionObserver.observe(s); });

  /* ---------- cursor: glow, dot and ring ---------- */
  const glow = document.querySelector('.cursor-glow');
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { x: mouse.x, y: mouse.y };
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`;
    if (finePointer) dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
  if (finePointer && !reduceMotion) {
    body.classList.add('has-cursor');
    const hoverSel = 'a, button, .project, .skill-tab, .chips span, .flow-step';
    document.addEventListener('pointerover', (e) => { if (e.target.closest(hoverSel)) ring.classList.add('hover'); });
    document.addEventListener('pointerout', (e) => { if (e.target.closest(hoverSel)) ring.classList.remove('hover'); });
    document.addEventListener('pointerdown', () => ring.classList.add('down'));
    document.addEventListener('pointerup', () => ring.classList.remove('down'));
  }

  /* ---------- tilt + spotlight + magnetic ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt, .tilt-soft').forEach((card) => {
      const amount = card.classList.contains('tilt') ? 10 : 6;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * amount}deg) rotateX(${-y * amount}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
  document.querySelectorAll('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- hero: interactive dot field ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('home');
    let w = 0, h = 0, dpr = 1, dots = [], running = false, tick = 0;
    const build = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = document.documentElement.clientWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 620 ? 34 : 30;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) dots.push({ x, y });
    };
    const draw = () => {
      if (!running) return;
      tick += 0.012;
      ctx.clearRect(0, 0, w, h);
      const r = canvas.getBoundingClientRect();
      const mx = mouse.x - r.left, my = mouse.y - r.top;
      const accent = getComputedStyle(body).getPropertyValue('--accent').trim() || '#b8ff3d';
      const light = body.classList.contains('light');
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - dist / 170);
        const wave = (Math.sin(d.x * 0.012 + d.y * 0.01 + tick * 2) + 1) / 2;
        const push = near * 10;
        const px = d.x + (dist ? (dx / dist) * push : 0);
        const py = d.y + (dist ? (dy / dist) * push : 0);
        ctx.beginPath();
        ctx.arc(px, py, 0.8 + near * 1.8 + wave * 0.4, 0, Math.PI * 2);
        if (near > 0.05) { ctx.fillStyle = accent; ctx.globalAlpha = 0.25 + near * 0.75; }
        else { ctx.fillStyle = light ? '#111318' : '#ffffff'; ctx.globalAlpha = 0.05 + wave * 0.07; }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    build();
    window.addEventListener('resize', build);
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) requestAnimationFrame(draw);
    }).observe(hero);
  }

  /* ---------- hero: typed role rotator ---------- */
  const typed = document.getElementById('typedRole');
  if (typed && !reduceMotion) {
    const roles = ['Full Stack Developer', 'Frontend Specialist', 'Three.js 3D Web Developer'];
    (async () => {
      let i = 0;
      await sleep(2200);
      for (;;) {
        const word = roles[++i % roles.length];
        for (let n = typed.textContent.length; n >= 0; n--) { typed.textContent = typed.textContent.slice(0, n); await sleep(28); }
        for (let n = 1; n <= word.length; n++) { typed.textContent = word.slice(0, n); await sleep(65); }
        await sleep(2200);
      }
    })();
  }

  /* ---------- number counters ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion) return;
    el.textContent = '0';
    onVisible(el, async () => {
      if (!body.classList.contains('loaded')) await sleep(900);
      const start = performance.now();
      const dur = 1400;
      const step = (now) => {
        const p = clamp((now - start) / dur, 0, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
  });

  /* ---------- about: words light up while scrolling ---------- */
  let scrubWords = [];
  const prepareScrub = () => {
    scrubWords = [];
    document.querySelectorAll('.scrub').forEach((el) => {
      splitWords(el, root.lang, 'sw');
      scrubWords.push({ el, words: [...el.querySelectorAll('.sw')] });
    });
  };
  prepareScrub();
  document.addEventListener('langchange', prepareScrub);

  /* ---------- marquee driven by scroll velocity ---------- */
  const marqueeRows = [...document.querySelectorAll('.marquee-row, .contact-marquee')].map((row) => {
    const track = row.querySelector('.marquee-track, .contact-marquee-track');
    track.innerHTML += track.innerHTML; // duplicate for a seamless loop
    return { row, track, dir: Number(row.dataset.dir || -1), x: 0, visible: true };
  });
  marqueeRows.forEach((m) => new IntersectionObserver(([e]) => { m.visible = e.isIntersecting; }).observe(m.row));

  /* ---------- experience: timeline rail fills on scroll ---------- */
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timelineFill');
  const timelineItems = timeline ? [...timeline.querySelectorAll('.timeline-item')] : [];

  /* ---------- projects: pinned horizontal scroll ---------- */
  const hScroll = document.getElementById('hScroll');
  const hTrack = document.getElementById('hTrack');
  const hBar = document.getElementById('hBar');
  const hIndex = document.getElementById('hIndex');
  const hCards = hTrack ? [...hTrack.children] : [];
  let hEnabled = false, hDistance = 0;
  const setupHorizontal = () => {
    hEnabled = !reduceMotion && window.innerWidth > 900;
    body.classList.toggle('hs-on', hEnabled);
    if (!hEnabled) { hScroll.style.height = ''; hTrack.style.transform = ''; return; }
    hDistance = Math.max(0, hTrack.scrollWidth - window.innerWidth);
    hScroll.style.height = `${hDistance + window.innerHeight}px`;
  };

  /* ---------- gallery parallax ---------- */
  const galleryItems = [...document.querySelectorAll('.g-item')];
  // observe the grid itself: the items are fully clipped until revealed, so they never report as intersecting
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) onVisible(galleryGrid, () => galleryItems.forEach((g) => g.classList.add('in')), { threshold: 0.2 });

  /* ---------- the single scroll/animation loop ---------- */
  let lastY = window.scrollY, velocity = 0;
  const frame = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    velocity += ((y - lastY) - velocity) * 0.15;
    lastY = y;

    const max = root.scrollHeight - root.clientHeight || 1;
    progress.style.transform = `scaleX(${clamp(y / max, 0, 1)})`;
    nav.classList.toggle('scrolled', y > 30);

    if (body.classList.contains('has-cursor')) {
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    }

    if (!reduceMotion) {
      // marquee rows
      marqueeRows.forEach((m) => {
        if (!m.visible) return;
        const speed = 0.6 + Math.min(Math.abs(velocity) * 0.25, 8);
        m.x += speed * m.dir * (velocity < -0.5 ? -1 : 1);
        const half = m.track.scrollWidth / 2;
        if (m.x <= -half) m.x += half;
        if (m.x > 0) m.x -= half;
        m.track.style.transform = `translate3d(${m.x}px,0,0) skewX(${clamp(-velocity * 0.15, -8, 8)}deg)`;
      });

      // about scrub text
      scrubWords.forEach(({ el, words }) => {
        const r = el.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
        const lit = Math.floor(p * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < lit));
      });

      // gallery parallax
      galleryItems.forEach((g) => {
        const r = g.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const offset = (r.top + r.height / 2 - vh / 2) * Number(g.dataset.speed || 0);
        g.style.setProperty('--py', `${offset}px`);
      });
    }

    // timeline rail
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = clamp((vh * 0.6 - r.top) / r.height, 0, 1);
      timelineFill.style.transform = `scaleY(${p})`;
      timelineItems.forEach((item) => {
        const ir = item.getBoundingClientRect();
        item.classList.toggle('lit', ir.top < vh * 0.6);
      });
    }

    // horizontal projects
    if (hEnabled) {
      const r = hScroll.getBoundingClientRect();
      const p = clamp(-r.top / (hScroll.offsetHeight - vh || 1), 0, 1);
      hTrack.style.transform = `translate3d(${-p * hDistance}px,0,0)`;
      hBar.style.transform = `scaleX(${p})`;
      const idx = Math.min(hCards.length - 1, Math.round(p * (hCards.length - 1)));
      hIndex.textContent = String(idx + 1).padStart(2, '0');
      hCards.forEach((c) => {
        const cr = c.getBoundingClientRect();
        const center = (cr.left + cr.width / 2 - window.innerWidth / 2) / window.innerWidth;
        c.style.setProperty('--shift', `${center * -40}px`);
      });
    }

    requestAnimationFrame(frame);
  };
  window.addEventListener('load', setupHorizontal);
  window.addEventListener('resize', setupHorizontal);
  document.addEventListener('langchange', () => requestAnimationFrame(setupHorizontal));
  setupHorizontal();
  requestAnimationFrame(frame);

  /* ---------- skills: 3D tag sphere + category filter ---------- */
  const sphere = document.getElementById('tagSphere');
  const groups = [...document.querySelectorAll('#skillGroups .skill-group')];
  if (sphere) {
    const tags = [];
    groups.forEach((g) => g.querySelectorAll('.chips span').forEach((chip) => {
      const tag = document.createElement('span');
      tag.textContent = chip.textContent;
      tag.dataset.cat = g.dataset.cat;
      sphere.appendChild(tag);
      tags.push(tag);
    }));
    const n = tags.length;
    const points = tags.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      return { x: Math.cos(theta) * Math.sin(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(phi) };
    });
    let ax = 0.0025, ay = 0.004, running = false;
    let radius = 0;
    const measure = () => { radius = sphere.clientWidth / 2 - 30; };
    measure();
    window.addEventListener('resize', measure);
    sphere.parentElement.addEventListener('pointermove', (e) => {
      const r = sphere.getBoundingClientRect();
      ay = ((e.clientX - r.left) / r.width - 0.5) * 0.03;
      ax = -((e.clientY - r.top) / r.height - 0.5) * 0.03;
    });
    const rotate = () => {
      if (!running) return;
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      points.forEach((p, i) => {
        const y1 = p.y * cx - p.z * sx; let z1 = p.y * sx + p.z * cx;
        const x2 = p.x * cy + z1 * sy; z1 = -p.x * sy + z1 * cy;
        p.x = x2; p.y = y1; p.z = z1;
        const scale = (p.z + 2) / 3;
        const tag = tags[i];
        tag.style.transform = `translate(-50%,-50%) translate3d(${p.x * radius}px,${p.y * radius}px,0) scale(${scale})`;
        tag.style.opacity = tag.classList.contains('dim') ? 0.12 : 0.25 + (p.z + 1) * 0.375;
        tag.style.zIndex = Math.round(scale * 100);
      });
      requestAnimationFrame(rotate);
    };
    if (reduceMotion) { running = true; rotate(); running = false; }
    else new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(rotate); }).observe(sphere);

    document.querySelectorAll('.skill-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const f = tab.dataset.filter;
        document.querySelectorAll('.skill-tab').forEach((x) => { x.classList.toggle('active', x === tab); x.setAttribute('aria-selected', x === tab); });
        groups.forEach((g) => g.classList.toggle('dim', f !== 'all' && g.dataset.cat !== f));
        tags.forEach((tg) => { tg.classList.toggle('dim', f !== 'all' && tg.dataset.cat !== f); tg.classList.toggle('hot', f !== 'all' && tg.dataset.cat === f); });
        if (reduceMotion) { running = true; rotate(); running = false; }
      });
    });
  }

  /* ---------- QA: replay of this site's own Jest + Postman (Newman) run ---------- */
  const termBody = document.getElementById('termBody');
  const termBar = document.getElementById('termBar');
  const termCount = document.getElementById('termCount');
  const termReplay = document.getElementById('termReplay');
  const terminal = document.getElementById('qaTerminal');
  const script = [
    { t: 'cmd', h: '<b>$</b> npm test' },
    { t: 'file', h: '<b class="ok">PASS</b> tests/utils.test.js' },
    { t: 'test', s: 'calculates experience from Nov 2021 to Sep 2026', ms: 4 },
    { t: 'test', s: 'formats the duration in English and Thai', ms: 2 },
    { t: 'file', h: '<b class="ok">PASS</b> tests/i18n.test.js' },
    { t: 'test', s: 'every data-i18n key has EN and TH text', ms: 11 },
    { t: 'test', s: 'keeps the same HTML tags in both languages', ms: 6 },
    { t: 'file', h: '<b class="ok">PASS</b> tests/page.test.js' },
    { t: 'test', s: 'switches the page to Thai and back', ms: 38 },
    { t: 'test', s: 'copies the email and shows a toast', ms: 21 },
    { t: 'cmd', h: '<b>$</b> npm run test:api <span class="dim"># newman + Postman collection</span>' },
    { t: 'test', s: 'GET  /                        → 200 · text/html', ms: 46 },
    { t: 'test', s: 'GET  /assets/pdf/CV-EN.pdf    → 200 · application/pdf', ms: 31 },
    { t: 'test', s: 'GET  /missing-page            → 404', ms: 12 },
    { t: 'test', s: 'GET  api.github.com/users/…   → 200 · login matches', ms: 228 },
    { t: 'sum', h: '✔ All tests passed' },
  ];
  const totalTests = script.filter((l) => l.t === 'test').length;
  let runId = 0;
  const addLine = (cls, html) => {
    const div = document.createElement('div');
    div.className = `tl ${cls}`;
    div.innerHTML = html;
    termBody.appendChild(div);
    return div;
  };
  const setCount = (n) => {
    termCount.textContent = `${n} / ${totalTests} passing`;
    termBar.style.width = `${(n / totalTests) * 100}%`;
  };
  const runTerminal = async () => {
    const id = ++runId;
    termBody.innerHTML = '';
    setCount(0);
    let passed = 0;
    for (const line of script) {
      if (id !== runId) return;
      if (line.t === 'test') {
        const el = addLine('test', `<span class="ic">◌</span>${line.s}`);
        if (!reduceMotion) {
          for (const f of ['◜', '◝', '◞', '◟']) { el.querySelector('.ic').textContent = f; await sleep(70 + line.ms / 18); if (id !== runId) return; }
        }
        el.classList.add('pass');
        el.innerHTML = `<span class="ic">✓</span>${line.s} <span class="ms">(${line.ms}ms)</span>`;
        setCount(++passed);
      } else {
        addLine(line.t, line.h);
        if (!reduceMotion) await sleep(line.t === 'cmd' ? 650 : 260);
      }
    }
    addLine('cmd', '<b>$</b> <span class="term-cursor"></span>');
  };
  if (terminal) onVisible(terminal, runTerminal, { threshold: 0.35 });
  if (termReplay) termReplay.addEventListener('click', () => {
    termReplay.classList.remove('spin'); void termReplay.offsetWidth; termReplay.classList.add('spin');
    runTerminal();
  });

  /* ---------- QA: workflow steps light up in sequence ---------- */
  const flow = document.getElementById('flowSteps');
  if (flow) {
    const steps = [...flow.querySelectorAll('.flow-step')];
    let current = -1, timer = null;
    const setStep = (i) => {
      current = i;
      steps.forEach((s, n) => { s.classList.toggle('active', n === i); s.classList.toggle('done', n < i); });
      flow.style.setProperty('--p', i / (steps.length - 1));
    };
    const start = () => { if (!timer && !reduceMotion) timer = setInterval(() => setStep((current + 1) % steps.length), 1500); };
    const stop = () => { clearInterval(timer); timer = null; };
    if (reduceMotion) setStep(steps.length - 1);
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (current < 0) setStep(0); start(); } else stop();
    }, { threshold: 0.4 }).observe(flow);
    steps.forEach((s, i) => {
      s.addEventListener('mouseenter', () => { stop(); setStep(i); });
      s.addEventListener('mouseleave', start);
    });
  }

  /* ---------- contact: copy email ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const email = 'sirawitpai0@gmail.com';
    try { await navigator.clipboard.writeText(email); showToast(`✓ ${t('contact.copied')}`); }
    catch (e) { window.location.href = `mailto:${email}`; }
  });
})();
