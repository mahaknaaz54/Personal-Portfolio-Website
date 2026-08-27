import {renderHeader} from './layout/Header.js';
import {renderFooter} from './layout/Footer.js';
import {initCursor} from './layout/Cursor.js';
import {initHero, initPetals} from './scenes/Hero.js';
import {initAbout} from './scenes/About.js';
import {initProjects} from './scenes/Projects.js';
import {initContact} from './scenes/Contact.js';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/scenes.css';

// Common chrome
const page = document.body.dataset.page || 'home';
renderHeader(page);
renderFooter();
initCursor(); // desktop only

// Global continuous atmospheric petals across all pages
const canvas = document.querySelector('.hero-canvas');
const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const dataReduced = document.documentElement.hasAttribute('data-reduced-motion');
if(canvas && !prefersReduced && !dataReduced){
  initPetals(canvas);
}

// Page‑specific scenes
if(document.querySelector('.hero')) initHero();
if(document.querySelector('.about')) initAbout();
if(document.querySelector('.projects')) initProjects();
if(document.querySelector('.contact')) initContact();

// Robust scroll reveal for any .reveal element
if(!prefersReduced && 'IntersectionObserver' in window){
  document.body.classList.add('js-reveal-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -40px 0px'});

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}