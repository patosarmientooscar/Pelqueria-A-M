/* ══════════════════════════════════════════════
   AMAD PEÑA BARBERSHOP — script.js
   ══════════════════════════════════════════════ */

'use strict';

/* ── SPOTLIGHT / GLOW CARD TRACKER ─────────── */
(function initGlowTracker() {
  const root = document.documentElement;

  function updateCards(clientX, clientY) {
    // Global hue shift (viewport-relative)
    root.style.setProperty('--xp', (clientX / window.innerWidth).toFixed(3));
    root.style.setProperty('--yp', (clientY / window.innerHeight).toFixed(3));

    // Per-card coordinates — relative to each card so transforms don't break it
    document.querySelectorAll('[data-glow].servicio-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', (clientX - rect.left).toFixed(1));
      card.style.setProperty('--y', (clientY - rect.top).toFixed(1));
      card.style.setProperty('--xp', ((clientX - rect.left) / rect.width).toFixed(3));
    });
  }

  document.addEventListener('pointermove', (e) => {
    updateCards(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    updateCards(t.clientX, t.clientY);
  }, { passive: true });
})();


/* ── NAVBAR SCROLL EFFECT ───────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── MOBILE MENU ────────────────────────────── */
(function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileClose  = document.getElementById('mobileClose');
  const overlay      = document.getElementById('mobileOverlay');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    overlay.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on any link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── SCROLL REVEAL (Intersection Observer) ── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── COUNTER ANIMATION ──────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-n[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ── HERO PARTICLES ─────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 30;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left   = Math.random() * 100 + '%';
    p.style.top    = Math.random() * 100 + '%';
    p.style.setProperty('--dur',   (4 + Math.random() * 8) + 's');
    p.style.setProperty('--delay', (Math.random() * 8) + 's');
    p.style.width  = (1 + Math.random() * 2) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = (0.1 + Math.random() * 0.5).toString();
    fragment.appendChild(p);
  }

  container.appendChild(fragment);
})();


/* ── ACTIVE NAV LINK ON SCROLL ──────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - navbarHeight - 80;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = 'var(--gold)';
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ── GALERÍA LIGHTBOX (simple) ──────────────── */
(function initLightbox() {
  const items = document.querySelectorAll('.galeria-item');
  if (!items.length) return;

  // Create lightbox elements
  const backdrop = document.createElement('div');
  backdrop.id = 'lightbox';
  backdrop.style.cssText = `
    display: none; position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.95); align-items: center; justify-content: center;
    cursor: zoom-out; padding: 24px;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw; max-height: 90vh; object-fit: contain;
    border-radius: 12px; box-shadow: 0 0 60px rgba(201,168,76,0.2);
    animation: lbFadeIn 0.3s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: fixed; top: 24px; right: 32px;
    background: rgba(201,168,76,0.2); border: 1px solid rgba(201,168,76,0.4);
    color: #C9A84C; font-size: 2rem; width: 48px; height: 48px;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: background 0.3s;
  `;

  const style = document.createElement('style');
  style.textContent = `@keyframes lbFadeIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }`;
  document.head.appendChild(style);

  backdrop.appendChild(img);
  backdrop.appendChild(closeBtn);
  document.body.appendChild(backdrop);

  const openLightbox = (src, alt) => {
    img.src = src;
    img.alt = alt;
    backdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    backdrop.style.display = 'none';
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      if (image) openLightbox(image.src, image.alt);
    });
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();
