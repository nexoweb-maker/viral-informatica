/* ═══════════════════════════════════════════════
   DELTA COMPUTERS — script.js
═══════════════════════════════════════════════ */

'use strict';

/* ─── HEADER SCROLL EFFECT ─── */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ─── ACTIVE NAV LINK (highlight on scroll) ─── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ─── HAMBURGER / MOBILE MENU ─── */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger sibling cards
          const delay = parseFloat(
            getComputedStyle(entry.target).getPropertyValue('transition-delay') || '0'
          );
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ─── COUNTER ANIMATION ─── */
(function () {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
})();

/* ─── HERO PARTICLES ─── */
(function () {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 18 : 36;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 6;
    const opacity = Math.random() * 0.5 + 0.1;

    Object.assign(dot.style, {
      position: 'absolute',
      left: x + '%',
      top: y + '%',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.5 ? '#0066FF' : '#00D4FF',
      opacity: opacity,
      animation: `particleFloat ${duration}s ${delay}s ease-in-out infinite alternate`,
      pointerEvents: 'none',
    });

    container.appendChild(dot);
  }

  // inject keyframes if not present
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particleFloat {
        from { transform: translate(0, 0) scale(1); }
        to   { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random()*30+10)}px, -${Math.floor(Math.random()*40+20)}px) scale(1.5); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ─── SMOOTH SCROLL (fallback for older browsers) ─── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('header')?.offsetHeight || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── CONTACT FORM → WHATSAPP ─── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Número real SIN +, SIN espacios, SIN guiones
  const WA_NUMBER = '5492392488913';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = form.querySelector('#nombre')?.value.trim();
    const mensaje = form.querySelector('#mensaje')?.value.trim();

    if (!nombre || !mensaje) {
      showFormMsg('Por favor completá todos los campos.', 'error');
      return;
    }

    const text = `Hola Viral Informática! \n\nMi nombre es *${nombre}*.\n\n${mensaje}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
    showFormMsg('¡Gracias! Te redirigimos a WhatsApp.', 'success');
    form.reset();
  });

  function showFormMsg(msg, type) {
    let el = document.getElementById('form-msg');
    if (!el) {
      el = document.createElement('p');
      el.id = 'form-msg';
      el.style.cssText = `
        margin-top: 8px;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: .85rem;
        font-weight: 600;
      `;
      form.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = type === 'success' ? 'rgba(37,211,102,.1)' : 'rgba(239,68,68,.1)';
    el.style.color     = type === 'success' ? '#25D366' : '#EF4444';
    el.style.border    = `1px solid ${type === 'success' ? 'rgba(37,211,102,.3)' : 'rgba(239,68,68,.3)'}`;
    setTimeout(() => el.remove(), 5000);
  }
})();

/* ─── LAZY LOAD IFRAME (Map) ─── */
(function () {
  const iframes = document.querySelectorAll('iframe[loading="lazy"]');
  // Native lazy loading handles this, but we add a small performance hint
  iframes.forEach((frame) => {
    frame.setAttribute('loading', 'lazy');
  });
})();
