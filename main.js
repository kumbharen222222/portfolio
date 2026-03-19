/* ================================
   main.js – Shared Portfolio Logic
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNav();
  initScrollReveal();
  setActiveNavLink();
  initParticles();
  init3DTilt();
  initMagneticButtons();
  init3DCursor();
});

/* ── Page Loader ── */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 300);
  });
}

/* ── Navigation ── */
function initNav() {
  const nav       = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    });
  });
}

/* ── Active nav link ── */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${(entry.target.dataset.delay || 0)}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ════════════════════════════════
   3D TILT EFFECT on cards
   Adds a CSS perspective transform that
   tracks mouse position over each card
   ════════════════════════════════ */
function init3DTilt() {
  const STRENGTH = 12; // degrees max tilt
  const SHINE_MAX = 0.18;

  function applyTilt(el) {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      const rotX = -dy * STRENGTH;
      const rotY =  dx * STRENGTH;

      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;
      el.style.transition = 'transform 0.1s linear';
      el.style.boxShadow  = `${-dx * 12}px ${-dy * 12}px 40px rgba(99,179,237,0.18), 0 8px 32px rgba(0,0,0,0.4)`;

      // Shine overlay
      let shine = el.querySelector('.tilt-shine');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'tilt-shine';
        shine.style.cssText = `
          position:absolute;inset:0;border-radius:inherit;pointer-events:none;
          transition:opacity 0.1s;z-index:10;
        `;
        el.style.position = 'relative';
        el.appendChild(shine);
      }
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const dist  = Math.sqrt(dx * dx + dy * dy);
      shine.style.background = `radial-gradient(circle at ${((dx + 1) / 2) * 100}% ${((dy + 1) / 2) * 100}%, rgba(255,255,255,${dist * SHINE_MAX}), transparent 70%)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s';
      el.style.boxShadow  = '';
      const shine = el.querySelector('.tilt-shine');
      if (shine) shine.style.background = 'none';
    });
  }

  // Apply to all cards and tilt-card elements
  document.querySelectorAll('.card, .tilt-card').forEach(applyTilt);
}

/* ════════════════════════════════
   3D MAGNETIC BUTTONS
   Buttons slightly follow mouse
   ════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.35;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
      btn.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });
}

/* ════════════════════════════════
   CUSTOM 3D GLOW CURSOR
   ════════════════════════════════ */
function init3DCursor() {
  if (window.matchMedia('(pointer:coarse)').matches) return; // skip on touch

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  // Smooth ring follow
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
    requestAnimationFrame(animateRing);
  })();

  // Grow on hover
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-grow'));
  });
}

/* ── Tiny canvas star-field ── */
function initParticles() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.2,
    a: Math.random() * Math.PI * 2,
    speed: 0.003 + Math.random() * 0.007,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
  }));

  let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed;
      // Subtle parallax drift towards cursor
      s.x += s.vx + (mouseX / canvas.width - 0.5) * 0.04;
      s.y += s.vy + (mouseY / canvas.height - 0.5) * 0.04;
      // Wrap
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;

      const alpha = 0.25 + 0.45 * Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Toast Notification ── */
window.showToast = function(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 4500);
};

/* ── Typed text animation ── */
window.initTyped = function(el, words, speed = 90, pause = 1800) {
  if (!el) return;
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);
    if (!deleting && ci === word.length) { setTimeout(() => { deleting = true; tick(); }, pause); return; }
    if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
};

/* ── Animated skill bars ── */
window.initSkillBars = function() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.width = e.target.dataset.level + '%'; obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
};

/* ── Smooth counter animation ── */
window.initCounters = function() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.count;
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          e.target.textContent = Math.floor(current) + (e.target.dataset.suffix || '');
          if (current >= target) clearInterval(timer);
        }, 16);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
};
