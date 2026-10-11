(() => {
  const root = document.documentElement;

  // If the animation libraries didn't load, fall back to the static first chapter.
  if (!window.gsap || !window.ScrollTrigger) {
    root.className = 'no-js';
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const FRAME_COUNT = 240;
  const FPS = 24;
  const ALT_START = 2940;
  const ALT_END = 3212;
  const frameSrc = (i) => `assets/frames/frame-${String(i + 1).padStart(3, '0')}.jpg`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const fmt = (n) => n.toLocaleString('en-US');

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ---------- Nav ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  ScrollTrigger.create({
    start: 'top -40',
    end: 'max',
    toggleClass: { className: 'is-scrolled', targets: nav },
  });
  burger.addEventListener('click', () => {
    const open = !root.classList.contains('nav-open');
    root.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  /* ---------- Frame canvas ---------- */
  const canvas = document.getElementById('frames');
  const ctx = canvas.getContext('2d', { alpha: false });
  const images = new Array(FRAME_COUNT);
  const loaded = new Uint8Array(FRAME_COUNT);
  let current = 0;
  let drawn = -1;
  let dirty = true;

  function nearestLoaded(i) {
    if (loaded[i]) return i;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (i - d >= 0 && loaded[i - d]) return i - d;
      if (i + d < FRAME_COUNT && loaded[i + d]) return i + d;
    }
    return -1;
  }

  function render() {
    const i = nearestLoaded(current);
    if (i < 0 || i === drawn) return;
    const img = images[i];
    const cw = canvas.width;
    const ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    drawn = i;
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    ctx.imageSmoothingQuality = 'high';
    drawn = -1;
    dirty = true;
  }
  resizeCanvas();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 120);
  });

  gsap.ticker.add(() => {
    if (!dirty) return;
    dirty = false;
    render();
  });

  /* ---------- Preload: coarse pass first so scrubbing works early ---------- */
  const firstPass = [];
  for (let i = 0; i < FRAME_COUNT; i += 8) firstPass.push(i);
  firstPass.push(FRAME_COUNT - 1);
  const queued = new Set(firstPass);
  const order = [...firstPass];
  [4, 2, 1].forEach((step) => {
    for (let i = 0; i < FRAME_COUNT; i += step) {
      if (!queued.has(i)) { queued.add(i); order.push(i); }
    }
  });

  const loaderFill = document.getElementById('loaderFill');
  const loaderPct = document.getElementById('loaderPct');
  const firstSet = new Set(firstPass);
  let firstDone = 0;
  let cursor = 0;
  let ready = false;

  function onFrameSettled(i, ok) {
    if (ok) { loaded[i] = 1; dirty = true; }
    if (firstSet.has(i)) {
      firstDone++;
      const p = firstDone / firstSet.size;
      loaderFill.style.transform = `scaleX(${p})`;
      loaderPct.textContent = pad(Math.round(p * 100), 3);
      if (firstDone === firstSet.size) start();
    }
    loadNext();
  }

  function loadNext() {
    if (cursor >= order.length) return;
    const i = order[cursor++];
    const img = new Image();
    img.decoding = 'async';
    img.src = frameSrc(i);
    images[i] = img;
    img.decode()
      .then(() => onFrameSettled(i, true))
      .catch(() => onFrameSettled(i, img.complete && img.naturalWidth > 0));
  }
  for (let k = 0; k < 6; k++) loadNext();
  setTimeout(start, 9000); // never hold the page hostage to a slow network

  /* ---------- HUD ---------- */
  const hudFrame = document.getElementById('hudFrame');
  const hudTime = document.getElementById('hudTime');
  const hudAlt = document.getElementById('hudAlt');
  const railFill = document.getElementById('railFill');
  const progressX = document.getElementById('progressX');
  const stops = [...document.querySelectorAll('.rail__stop')];
  let lastHudFrame = -1;
  let activeStop = 0;

  function updateHud(f) {
    if (f === lastHudFrame) return;
    lastHudFrame = f;
    const p = f / (FRAME_COUNT - 1);
    hudFrame.textContent = pad(f + 1, 3);
    hudTime.textContent = `00:${pad(Math.floor(f / FPS))}:${pad(f % FPS)}`;
    hudAlt.textContent = fmt(Math.round(ALT_START + p * (ALT_END - ALT_START)));
    railFill.style.transform = `scaleY(${p})`;
    progressX.style.transform = `scaleX(${p})`;
    const idx = Math.min(2, Math.floor(f / (FRAME_COUNT / 3)));
    if (idx !== activeStop) {
      stops[activeStop].classList.remove('is-active');
      stops[idx].classList.add('is-active');
      activeStop = idx;
    }
  }

  /* ---------- Route profile (chapter 02) ---------- */
  const routePath = document.getElementById('routePath');
  const routeDot = document.getElementById('routeDot');
  const routeCursor = document.getElementById('routeCursor');
  const routeKm = document.getElementById('routeKm');
  const routeAlt = document.getElementById('routeAlt');
  const routeLen = routePath.getTotalLength();
  routePath.style.strokeDasharray = routeLen;
  routePath.style.strokeDashoffset = routeLen;

  function updateRoute(p) {
    routePath.style.strokeDashoffset = routeLen * (1 - p);
    const pt = routePath.getPointAtLength(routeLen * p);
    routeDot.setAttribute('cx', pt.x);
    routeDot.setAttribute('cy', pt.y);
    routeCursor.setAttribute('x1', pt.x);
    routeCursor.setAttribute('x2', pt.x);
    routeKm.textContent = (p * 4.6).toFixed(1);
    routeAlt.textContent = fmt(Math.round(ALT_START + ((96 - pt.y) / 86) * (ALT_END - ALT_START)));
  }

  /* ---------- Master scroll timeline (3 units = 3 chapters) ---------- */
  const playhead = { frame: 0 };
  const route = { p: 0 };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '#ride',
      start: 'top top',
      end: 'bottom bottom',
      scrub: lenis ? true : 0.5,
    },
  });

  tl.to(playhead, {
    frame: FRAME_COUNT - 1,
    duration: 3,
    onUpdate() {
      const f = Math.round(playhead.frame);
      if (f !== current) { current = f; dirty = true; }
      updateHud(f);
    },
  }, 0);

  tl.to('.scroll-cue', { autoAlpha: 0, duration: 0.12 }, 0.02);

  // 01 out
  tl.to('.chapter--1', { autoAlpha: 0, y: -48, duration: 0.24, ease: 'power2.in' }, 0.7)
    .to('.shade--right', { opacity: 0, duration: 0.3 }, 0.78)
    .to('.shade--left', { opacity: 1, duration: 0.3 }, 0.82);

  // 02 in
  const reveal = (sel, at) => {
    tl.set(sel, { autoAlpha: 1 }, at)
      .fromTo(`${sel} .line > span`, { yPercent: 112 }, { yPercent: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }, at)
      .fromTo(`${sel} .rule`, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power3.out' }, at + 0.1)
      .fromTo(`${sel} .fade`, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.05, ease: 'power2.out' }, at + 0.08);
  };
  reveal('.chapter--2', 1.0);
  tl.to(route, { p: 1, duration: 0.75, onUpdate: () => updateRoute(route.p) }, 1.08);

  // 02 out
  tl.to('.chapter--2', { autoAlpha: 0, y: -48, duration: 0.24, ease: 'power2.in' }, 1.72);

  // 03 in — the frames get whiter up high, so pull the exposure down a touch
  tl.to('.shade--dim', { opacity: 0.16, duration: 0.6 }, 1.8);
  reveal('.chapter--3', 2.02);

  // out: the last frame dissolves into white, like riding into snow mist,
  // so the ride hands over seamlessly to the white mountain section
  tl.to('.chapter--3', { autoAlpha: 0, y: -30, duration: 0.2, ease: 'power2.in' }, 3.05)
    .to('.whiteout', { opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 3.1);

  /* ---------- Rise: mountain cut-out (JPG + alpha mask composed on a canvas) ---------- */
  const mountainWrap = document.querySelector('.rise__mountain');
  const mountainCanvas = document.getElementById('mountainCanvas');
  const loadImg = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  let mountainSrc = null;

  // Draw the cut-out once at the size it is shown (not always 2400px), with the soft
  // blur on its foot baked in, so scrolling only moves a ready-made layer.
  function composeMountain() {
    if (!mountainSrc) return;
    const [photo, mask] = mountainSrc;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(photo.naturalWidth, Math.ceil(mountainWrap.offsetWidth * dpr * 1.12));
    if (mountainWrap.classList.contains('is-ready') && Math.abs(w - mountainCanvas.width) < w * 0.15) return;
    const h = Math.round(w * photo.naturalHeight / photo.naturalWidth);
    mountainCanvas.width = w;
    mountainCanvas.height = h;
    const mctx = mountainCanvas.getContext('2d');
    mctx.drawImage(mask, 0, 0, w, h);
    mctx.globalCompositeOperation = 'source-in';
    mctx.drawImage(photo, 0, 0, w, h);
    mctx.globalCompositeOperation = 'source-over';

    if ('filter' in mctx) {
      const soft = document.createElement('canvas');
      soft.width = w;
      soft.height = h;
      const sctx = soft.getContext('2d');
      sctx.filter = `blur(${Math.round((w / mountainWrap.offsetWidth) * 14)}px)`;
      sctx.drawImage(mountainCanvas, 0, 0);
      sctx.filter = 'none';
      sctx.globalCompositeOperation = 'destination-in';
      const fade = sctx.createLinearGradient(0, h * 0.55, 0, h * 0.88);
      fade.addColorStop(0, 'rgba(0,0,0,0)');
      fade.addColorStop(1, 'rgba(0,0,0,1)');
      sctx.fillStyle = fade;
      sctx.fillRect(0, 0, w, h);
      mctx.drawImage(soft, 0, 0);
    }
    mountainWrap.classList.add('is-ready');
  }

  Promise.all([loadImg('assets/img/mountain.jpg'), loadImg('assets/img/mountain-mask.png')])
    .then((imgs) => { mountainSrc = imgs; composeMountain(); })
    .catch(() => { /* fallback <img> (white sky) stays visible */ });
  let composeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(composeTimer);
    composeTimer = setTimeout(composeMountain, 250);
  });

  // Park the name so its lower edge tucks behind the main peak (17% down the photo),
  // whatever the screen shape. Layout sizes only, so the scroll transforms don't skew it.
  const riseStage = document.querySelector('.rise__stage');
  const riseTitle = document.querySelector('.rise__title');
  const PEAK = 0.172;
  function layoutRise() {
    const mountainTop = riseStage.offsetHeight - mountainWrap.offsetHeight;
    const peakY = mountainTop + mountainWrap.offsetHeight * PEAK;
    const minTop = nav.offsetHeight + 56;
    riseTitle.style.top = `${Math.max(minTop, peakY - riseTitle.offsetHeight * 0.8)}px`;
  }
  layoutRise();
  window.addEventListener('resize', layoutRise);
  if (document.fonts) document.fonts.ready.then(layoutRise);

  // One timeline from the moment the section enters (not just once it pins), with a
  // little scrub lag so the parallax glides instead of tracking every wheel tick.
  const riseSection = document.getElementById('rise');
  const entry = Math.min(0.5, window.innerHeight / riseSection.offsetHeight);
  const pinned = 1 - entry;
  const riseTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: riseSection,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  });
  riseTl
    .fromTo('.rise__mountain', { yPercent: 18, scale: 1.12 }, { yPercent: 0, scale: 1, duration: entry + pinned * 0.6, ease: 'power1.out' }, 0)
    .fromTo('.rise__title', { yPercent: 140, scale: 0.94 }, { yPercent: 0, scale: 1, duration: pinned * 0.6, ease: 'power2.out' }, entry)
    .fromTo('.rise__meta', { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: pinned * 0.15 }, entry + pinned * 0.32)
    .fromTo('.rise__copy .fade', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: pinned * 0.18, stagger: pinned * 0.04, ease: 'power2.out' }, entry + pinned * 0.45)
    .to({}, { duration: 0.0001 }, 1);

  /* ---------- Field notes ---------- */
  gsap.from('.field__head > *', {
    autoAlpha: 0, y: 30, duration: 1, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.field__head', start: 'top 85%', once: true },
  });
  gsap.fromTo('.panel',
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, stagger: 0.14, ease: 'power4.inOut',
      scrollTrigger: { trigger: '.field__grid', start: 'top 80%', once: true },
    });
  gsap.from('.panel__cap > *', {
    autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.06, delay: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.field__grid', start: 'top 80%', once: true },
  });
  gsap.utils.toArray('.panel__media').forEach((media) => {
    gsap.fromTo(media, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: media.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  gsap.from('.field__foot > *', {
    autoAlpha: 0, duration: 0.8, stagger: 0.05,
    scrollTrigger: { trigger: '.field__foot', start: 'top 95%', once: true },
  });

  /* ---------- The après kit ---------- */
  const kitList = document.querySelector('.kit__list');
  const scents = gsap.utils.toArray('.scent');
  scents.forEach((row, i) => row.style.setProperty('--i', i));

  gsap.from('.kit__head > *', {
    autoAlpha: 0, y: 30, duration: 1, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.kit__head', start: 'top 85%', once: true },
  });
  ScrollTrigger.create({
    trigger: kitList, start: 'top 80%', once: true,
    onEnter: () => kitList.classList.add('is-in'),
  });
  // whole rows, not each piece of text: 4 layers to paint instead of 20
  gsap.from(scents, {
    autoAlpha: 0, y: 28, duration: 0.9, ease: 'power3.out', stagger: 0.09,
    clearProps: 'opacity,visibility,transform', // hand opacity back to the CSS hover-dim
    scrollTrigger: { trigger: kitList, start: 'top 80%', once: true },
  });
  gsap.from('.kit__bundle > *, .kit__features .feature', {
    autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '.kit__bundle', start: 'top 88%', once: true },
  });

  // Cursor-following preview (mouse/trackpad only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const preview = document.querySelector('.kit__preview');
    const previewImg = preview.querySelector('img');
    const moveX = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3.out' });
    const moveY = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3.out' });
    let shown = false;

    kitList.addEventListener('mousemove', (e) => {
      if (!shown) gsap.set(preview, { x: e.clientX, y: e.clientY });
      moveX(e.clientX);
      moveY(e.clientY);
    });
    scents.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        const src = row.dataset.img;
        if (!previewImg.src.endsWith(src)) {
          previewImg.src = src;
          gsap.fromTo(previewImg, { scale: 1.25 }, { scale: 1.08, duration: 0.9, ease: 'power3.out' });
        }
        if (!shown) {
          shown = true;
          gsap.to(preview, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power4.out', overwrite: 'auto' });
        }
      });
    });
    kitList.addEventListener('mouseleave', () => {
      shown = false;
      gsap.to(preview, { clipPath: 'inset(50% 50% 50% 50%)', duration: 0.45, ease: 'power3.in', overwrite: 'auto',
        onComplete: () => gsap.set(preview, { autoAlpha: 0 }) });
    });
  }

  // Add to bag
  const bag = document.getElementById('bag');
  const bagCount = document.getElementById('bagCount');
  let bagItems = 0;
  document.querySelectorAll('.scent__add').forEach((btn) => {
    const label = btn.querySelector('span');
    let timer;
    btn.addEventListener('click', () => {
      bagItems++;
      bagCount.textContent = `(${bagItems})`;
      bag.setAttribute('aria-label', `Bag, ${bagItems} item${bagItems === 1 ? '' : 's'}`);
      bag.classList.remove('is-bumped');
      void bag.offsetWidth;
      bag.classList.add('is-bumped');
      btn.classList.add('is-added');
      label.textContent = 'Added';
      clearTimeout(timer);
      timer = setTimeout(() => { btn.classList.remove('is-added'); label.textContent = 'Add'; }, 1600);
    });
  });

  /* ---------- Footer ---------- */
  const ridge = document.getElementById('footerRidge');
  const ridgeLen = ridge.getTotalLength();
  gsap.fromTo(ridge, { strokeDasharray: ridgeLen, strokeDashoffset: ridgeLen }, {
    strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut',
    scrollTrigger: { trigger: '.footer__ridge', start: 'top 92%', once: true },
  });
  gsap.from('.footer__join-copy > *, .join, .footer__grid > *', {
    autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.07, ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true },
  });

  // Sign-up is front-end only for now: validate, then confirm in place.
  const joinForm = document.getElementById('joinForm');
  const joinEmail = document.getElementById('joinEmail');
  const joinMsg = document.getElementById('joinMsg');
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(joinEmail.value.trim());
    joinMsg.classList.toggle('is-error', !ok);
    joinMsg.classList.toggle('is-ok', ok);
    joinMsg.textContent = ok ? "You're in. See you on the mountain." : 'That email looks off. Try again.';
    joinEmail.setAttribute('aria-invalid', String(!ok));
    if (ok) joinForm.reset();
  });

  document.getElementById('toTop').addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Nav goes ink over the white sections ---------- */
  // flips once the ride has mostly dissolved to white
  ScrollTrigger.create({
    trigger: '#ride',
    start: () => tl.scrollTrigger.start + (tl.scrollTrigger.end - tl.scrollTrigger.start) * (3.3 / 3.5),
    endTrigger: '#field',
    end: 'bottom 40px',
    toggleClass: { className: 'nav--light', targets: nav },
  });

  /* ---------- Rail navigation ---------- */
  stops.forEach((btn) => {
    btn.addEventListener('click', () => {
      const st = tl.scrollTrigger;
      const y = st.start + (st.end - st.start) * Number(btn.dataset.goto);
      if (lenis) lenis.scrollTo(y, { duration: 1.6 });
      else window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Intro ---------- */
  function intro() {
    if (reduceMotion) return;
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.nav', { y: -20, autoAlpha: 0, duration: 0.9 }, 0)
      .from('.chapter--1 .line > span', { yPercent: 112, duration: 1.1, stagger: 0.1 }, 0.1)
      .from('.chapter--1 .rule', { scaleX: 0, duration: 0.9 }, 0.35)
      .from('.chapter--1 .fade', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.07 }, 0.4)
      .from('.bracket', { autoAlpha: 0, scale: 0.4, duration: 0.7, stagger: 0.05 }, 0.2)
      .from('.rail', { scaleY: 0, duration: 1.1, ease: 'power3.inOut' }, 0.3)
      .from('.rail__stop, .rail__end', { autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.8)
      .from('.hud__meta, .scroll-cue', { autoAlpha: 0, duration: 0.8 }, 0.7);
  }

  function start() {
    if (ready) return;
    ready = true;
    root.classList.remove('is-loading');
    ScrollTrigger.refresh();
    const loader = document.getElementById('loader');
    gsap.to(loader, {
      yPercent: -100,
      duration: reduceMotion ? 0 : 1.1,
      ease: 'power4.inOut',
      delay: 0.15,
      onComplete: () => {
        loader.remove();
        if (lenis) lenis.start();
      },
    });
    gsap.delayedCall(reduceMotion ? 0 : 0.7, intro);
  }
})();
