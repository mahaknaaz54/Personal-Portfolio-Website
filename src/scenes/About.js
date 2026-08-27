import {gsap} from 'gsap';
import {reveal, parallax} from '../lib/gsap-utils.js';
import {initPetals} from './Hero.js';

export function initAbout(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const dataReduced = document.documentElement.hasAttribute('data-reduced-motion');
  const reduced = prefersReduced || dataReduced;

  const canvas = document.querySelector('.hero-canvas');
  if(canvas && !reduced) initPetals(canvas);

  reveal('.about-portrait-wrap',{start:'top 85%'});
  reveal('.about-text',{start:'top 80%'});
  reveal('.about-facts',{start:'top 85%'});
  reveal('.tech-card',{start:'top 85%'});
  
  // subtle parallax on portrait
  parallax('.about-portrait',0.1);

  // count‑up numbers
  document.querySelectorAll('.stat-value').forEach(el=>{
    const txt=el.textContent.trim();
    const num=parseInt(txt.replace(/\D/g,''),10);
    if(isNaN(num)) return;
    const suffix=txt.replace(/[\d]/g,'');
    gsap.fromTo({v:0},{v:num,duration:2,ease:'power2.out',
      onUpdate:function(){el.textContent=Math.round(this.targets()[0].v)+suffix;},
      scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none none'}
    });
  });
}