import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function magnetic(btn,strength=0.06){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const dx=(e.clientX-cx)*strength, dy=(e.clientY-cy)*strength;
    gsap.to(btn,{x:dx,y:dy,duration:.3,ease:'power3.out'});
  });
  btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.4,ease:'elastic.out(1,.5)'}));
}

export function reveal(selector,opts={}){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.querySelectorAll(selector).forEach(el=>el.style.opacity=1);
    return;
  }
  gsap.utils.toArray(selector).forEach((el,i)=>{
    gsap.fromTo(el,
      {autoAlpha:0,y:30},
      {autoAlpha:1,y:0,duration:.9,ease:'power3.out',delay:i*0.07,
       scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none',...opts}}
    );
  });
}

export function parallax(selector,speed=0.15){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  gsap.to(selector,{yPercent:speed*100,ease:'none',scrollTrigger:{trigger:selector,start:'top bottom',end:'bottom top',scrub:true}});
}