/**
 * Portfolio – Mahak Naaz
 * script.js – Minimal, accessible JavaScript
 *
 * Features:
 *   1. Dark / Light theme toggle (persists via localStorage)
 *   2. Active nav link (aria-current="page")
 *   3. Mobile navigation (aria-expanded, keyboard, Escape)
 *   4. Scroll-reveal animation (respects prefers-reduced-motion)
 *   5. Contact form validation (accessible error messages)
 *   6. Project filter (projects.html)
 */

'use strict';

/* ============================================================
   1. Theme Toggle
   ============================================================ */
(function initTheme() {
  const toggle  = document.getElementById('theme-toggle');
  const root    = document.documentElement;
  const stored  = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.dataset.theme || 'light';
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  function applyTheme(t) {
    root.dataset.theme = t;
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }
})();

/* ============================================================
   2. Active Nav Link
   ============================================================ */
(function setActivePage() {
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link[data-page]');

  links.forEach(link => {
    const page = link.dataset.page;
    if (page === path || (path === '' && page === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();

/* ============================================================
   3. Mobile Navigation
   ============================================================ */
(function initMobileNav() {
  const toggle   = document.getElementById('menu-toggle');
  const wrapper  = document.getElementById('nav-wrapper');
  const navLinks = wrapper ? wrapper.querySelectorAll('.nav-link') : [];

  if (!toggle || !wrapper) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    wrapper.classList.add('is-open');
    // Move focus to first nav link
    if (navLinks.length) navLinks[0].focus();
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleOutsideClick);
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('is-open');
    toggle.focus();
    document.removeEventListener('keydown', handleEscape);
    document.removeEventListener('click', handleOutsideClick);
  }

  function handleEscape(e) {
    if (e.key === 'Escape') closeMenu();
  }

  function handleOutsideClick(e) {
    if (!wrapper.contains(e.target) && e.target !== toggle) {
      closeMenu();
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click (navigating away)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (wrapper.classList.contains('is-open')) closeMenu();
    });
  });
})();

/* ============================================================
   4. Scroll Reveal
   ============================================================ */
(function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. Contact Form Validation
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),    errorEl: form.querySelector('#name-error'),    validate: val => val.trim().length >= 2 ? '' : 'Please enter your full name (at least 2 characters).' },
    email:   { el: form.querySelector('#email'),   errorEl: form.querySelector('#email-error'),   validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid email address.' },
    subject: { el: form.querySelector('#subject'), errorEl: form.querySelector('#subject-error'), validate: val => val.trim().length >= 3 ? '' : 'Please enter a subject (at least 3 characters).' },
    message: { el: form.querySelector('#message'), errorEl: form.querySelector('#message-error'), validate: val => val.trim().length >= 10 ? '' : 'Please enter your message (at least 10 characters).' },
  };

  const successMsg = document.getElementById('form-success');

  function showError(field, msg) {
    const { el, errorEl } = field;
    errorEl.textContent = msg;
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', errorEl.id);
  }

  function clearError(field) {
    const { el, errorEl } = field;
    errorEl.textContent = '';
    el.setAttribute('aria-invalid', 'false');
    el.removeAttribute('aria-describedby');
  }

  // Validate on blur for early feedback
  Object.values(fields).forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => {
      if (field.el.value.trim() !== '') {
        const msg = field.validate(field.el.value);
        msg ? showError(field, msg) : clearError(field);
      }
    });

    field.el.addEventListener('input', () => {
      if (field.el.getAttribute('aria-invalid') === 'true') {
        const msg = field.validate(field.el.value);
        msg ? showError(field, msg) : clearError(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstError = null;
    let isValid    = true;

    Object.values(fields).forEach(field => {
      if (!field.el) return;
      const msg = field.validate(field.el.value);
      if (msg) {
        showError(field, msg);
        if (!firstError) firstError = field.el;
        isValid = false;
      } else {
        clearError(field);
      }
    });

    if (!isValid) {
      firstError.focus();
      return;
    }

    // Show success message (simulated – no backend in this demo)
    form.style.display = 'none';
    if (successMsg) {
      successMsg.classList.add('is-visible');
      successMsg.focus();
    }
  });
})();

/* ============================================================
   6. Project Filter (projects.html - static fallback)
   (Dynamic filtering is handled in github-projects.js once loaded)
   ============================================================ */
(function initProjectFilter() {
  // If github-projects handles the page dynamically, let it manage filtering
  if (document.querySelector('.projects-grid[data-page="projects"]')) return;

  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  function filterProjects(category) {
    projectCards.forEach(card => {
      const cats = card.dataset.category.split(',').map(s => s.trim());
      const show  = category === 'all' || cats.includes(category);
      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      filterProjects(btn.dataset.filter);
    });

    btn.addEventListener('keydown', (e) => {
      // Arrow key navigation within filter bar
      const all = [...filterBtns];
      const idx = all.indexOf(btn);
      if (e.key === 'ArrowRight' && idx < all.length - 1) {
        e.preventDefault();
        all[idx + 1].focus();
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        all[idx - 1].focus();
      }
    });
  });
})();

/* ============================================================
   7. Stat Counter Animation (home page stats)
   ============================================================ */
(function initStatCounters() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statValues = document.querySelectorAll('.stat-card-mini__value');
  if (!statValues.length) return;

  function animateValue(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = text.slice(match[0].length);
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -20px 0px' });

  statValues.forEach(el => observer.observe(el));
})();

/* ============================================================
   8. Magnetic Buttons (very subtle)
   ============================================================ */
(function initMagneticButtons() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const buttons = document.querySelectorAll('.btn--primary, .btn--outline');
  const strength = 0.05; // tiny movement

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('focus', () => btn.style.transform = '');
    btn.addEventListener('blur', () => btn.style.transform = '');
  });
})();

/* ============================================================
   9. Hero Image Parallax on Scroll (very subtle)
   ============================================================ */
(function initHeroParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroImg = document.querySelector('.hero__avatar-img');
  if (!heroImg) return;

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const offset = scrollY * 0.03; // very subtle
        heroImg.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   10. Decorative Blobs – mouse & scroll parallax (very subtle)
   ============================================================ */
(function initDecorativeBlobs() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create blobs if not already in DOM
  const blobClasses = ['decor-blob--1','decor-blob--2','decor-blob--3'];
  blobClasses.forEach(cls => {
    if (!document.querySelector('.'+cls)) {
      const el = document.createElement('div');
      el.className = 'decor-blob ' + cls;
      document.body.appendChild(el);
    }
  });

  const blobs = document.querySelectorAll('.decor-blob');
  if (!blobs.length) return;

  let mouseX = 0, mouseY = 0;
  let scrollY = 0;

  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 8; // reduced
      mouseY = (e.clientY / window.innerHeight - 0.5) * 8;
      requestAnimationFrame(updateBlobs);
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY * 0.015; // reduced
      requestAnimationFrame(updateBlobs);
    }, { passive: true });
  }

  function updateBlobs() {
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.2; // shallower depth
      const tx = mouseX * factor;
      const ty = mouseY * factor + scrollY * factor;
      blob.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  }
})();

/* ============================================================
   11. Page Transition Overlay (fast, optional)
   ============================================================ */
(function initPageTransition() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    e.preventDefault();
    overlay.classList.add('is-active');
    setTimeout(() => {
      window.location.href = href;
    }, 50); // faster
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('is-active');
  });
})();

/* ============================================================
   12. Reduced Motion Toggle UI
   ============================================================ */
(function initReducedMotionToggle() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const stored = localStorage.getItem('portfolio-reduced-motion');
  const forced = stored === 'true';
  if (forced || prefersReduced) {
    root.setAttribute('data-reduced-motion', '');
  }

  // create button next to theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  const btn = document.createElement('button');
  btn.className = 'reduce-motion-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-pressed', forced ? 'true' : 'false');
  btn.setAttribute('aria-label', forced ? 'Enable animations' : 'Reduce motion');
  btn.innerHTML = `
    <svg class="icon-motion-on" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
    <svg class="icon-motion-off" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
  `;
  themeToggle.parentNode.insertBefore(btn, themeToggle.nextSibling);

  const iconOn = btn.querySelector('.icon-motion-on');
  const iconOff = btn.querySelector('.icon-motion-off');
  function updateIcons(state) {
    if (state) {
      iconOn.style.display = 'none';
      iconOff.style.display = 'block';
    } else {
      iconOn.style.display = 'block';
      iconOff.style.display = 'none';
    }
  }
  updateIcons(forced);

  btn.addEventListener('click', () => {
    const next = !root.hasAttribute('data-reduced-motion');
    if (next) {
      root.setAttribute('data-reduced-motion', '');
      localStorage.setItem('portfolio-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
      localStorage.setItem('portfolio-reduced-motion', 'false');
    }
    btn.setAttribute('aria-pressed', next);
    btn.setAttribute('aria-label', next ? 'Enable animations' : 'Reduce motion');
    updateIcons(next);
  });
})();

/* ============================================================
   13. Copy Email Buttons
   ============================================================ */
(function initCopyEmailButtons() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    if (link.parentNode.querySelector('.copy-email-btn')) return; // avoid duplicate
    const btn = document.createElement('button');
    btn.className = 'btn btn--ghost btn--sm copy-email-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy email address');
    btn.style.marginLeft = 'var(--space-2)';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = link.href.replace('mailto:', '');
      try {
        await navigator.clipboard.writeText(email);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 1500);
      } catch (_) {
        // fallback: select text
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      }
    });
    link.insertAdjacentElement('afterend', btn);
  });
})();

/* ============================================================
   14. Performance Marks
   ============================================================ */
(function initPerformanceMarks() {
  if (!window.performance || !performance.mark) return;
  performance.mark('portfolio:dom-loaded');
  window.addEventListener('load', () => performance.mark('portfolio:fully-loaded'));
  // optional: measure hero ready after first paint
  requestAnimationFrame(() => performance.mark('portfolio:first-paint'));
})();
