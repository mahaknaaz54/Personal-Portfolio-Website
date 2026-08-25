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
