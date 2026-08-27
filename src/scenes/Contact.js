import {reveal} from '../lib/gsap-utils.js';

export function initContact(){
  reveal('.contact h2',{start:'top 80%'});
  reveal('.contact-links .btn',{start:'top 90%'});
}