import {gsap} from 'gsap';

export function initHero(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const dataReduced = document.documentElement.hasAttribute('data-reduced-motion');
  const reduced = prefersReduced || dataReduced;

  const canvas = document.querySelector('.hero-canvas');
  if(canvas && !reduced) initPetals(canvas);

  // Entrance choreography
  if(!reduced){
    const tl = gsap.timeline({defaults:{ease:'power3.out'}});

    tl.set(['.hero-top','.hero-name','.hero-statement','.hero-tag','.hero-cta','.hero-m'], {autoAlpha:0})
      .to('.hero-top', {autoAlpha:1, duration:0.8, y:0}, 0.2)
      .from('.hero-top', {y:10, duration:0.8}, 0.2)
      .to('.hero-name', {autoAlpha:1, duration:1.2}, 0.5)
      .from('.hero-name', {y:80, skewY:3, duration:1.2}, 0.5)
      .to('.hero-m', {autoAlpha:0.38, duration:1.8, ease:'power2.out'}, 0.7)
      .from('.hero-m', {scale:0.9, duration:1.8, ease:'power2.out'}, 0.7)
      .to('.hero-statement', {autoAlpha:1, duration:0.9}, 1.1)
      .from('.hero-statement', {y:20, duration:0.9}, 1.1)
      .to('.hero-tag', {autoAlpha:1, duration:0.9}, 1.3)
      .from('.hero-tag', {y:20, duration:0.9}, 1.3)
      .to('.hero-cta', {autoAlpha:1, duration:0.7}, 1.5)
      .from('.hero-cta .btn', {y:15, autoAlpha:0, stagger:0.1, duration:0.6}, 1.5);

    // Subtle scroll-linked parallax on decorative M
    const heroM = document.querySelector('.hero-m');
    if(heroM){
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const offset = scrollY * 0.12;
        heroM.style.transform = `translateY(calc(-56% - ${offset}px))`;
      }, {passive:true});
    }
  } else {
    gsap.set(['.hero-top','.hero-name','.hero-statement','.hero-tag','.hero-cta','.hero-m'], {autoAlpha:1});
  }
}

/* ============================================================
   Sparse, Continuous Cherry Blossom Petal Atmosphere
   - Negative-space distribution (margins & channels)
   - Gentle, independent downward breeze
   - Low opacity, subtle background presence
   - Active immediately from the very top of Home
   ============================================================ */
export function initPetals(canvas){
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Sparse population: 28 on desktop, 18 on tablet/mobile
  const PETAL_COUNT = width < 768 ? 18 : 28;
  const petals = [];

  // Delicate plum wine color palette (Pantone 18-1411 TCX Plum Wine tints)
  const petalColors = [
    {r: 236, g: 218, b: 226}, // soft plum blush
    {r: 202, g: 160, b: 181}, // muted plum rose
    {r: 218, g: 188, b: 202}, // pale plum highlight
    {r: 185, g: 140, b: 162}, // delicate plum wine petal
    {r: 165, g: 115, b: 140}, // rich plum wine accent
  ];

  // Helper for negative-space X distribution
  function getNegativeSpaceX(){
    const rand = Math.random();
    if(rand < 0.40){
      // Left margin / negative space
      return Math.random() * (width * 0.28);
    } else if(rand < 0.80){
      // Right margin / negative space
      return width * 0.72 + Math.random() * (width * 0.28);
    } else {
      // Central flow channel
      return width * 0.35 + Math.random() * (width * 0.30);
    }
  }

  class Petal {
    constructor(index){
      this.index = index;
      this.reset(true);
    }

    reset(initial){
      this.x = getNegativeSpaceX();
      this.baseX = this.x;
      this.y = initial ? Math.random() * height : -30 - Math.random() * 70;
      this.size = 8 + Math.random() * 9; // 8–17px (delicate, natural)
      this.aspect = 0.52 + Math.random() * 0.24;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.014; // slow, serene spin
      this.speedY = 0.32 + Math.random() * 0.42; // gentle downward drift
      this.swayAmplitude = 16 + Math.random() * 28; // soft sway
      this.swayFrequency = 0.005 + Math.random() * 0.007;
      this.swayOffset = Math.random() * Math.PI * 2;
      
      // Restrained, visible opacity (0.14 to 0.30)
      this.baseOpacity = 0.14 + Math.random() * 0.16;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.life = initial ? Math.random() * 800 : 0;
    }

    update(scrollRatio){
      this.life++;
      this.y += this.speedY;
      this.x = this.baseX + Math.sin(this.life * this.swayFrequency + this.swayOffset) * this.swayAmplitude;
      this.baseX += (Math.random() - 0.5) * 0.06;
      this.rotation += this.rotationSpeed;

      // Gradual density gradient: top (1.0) -> middle (0.75) -> lower (0.45)
      // Never disappearing abruptly, maintaining sparse continuous flow
      const indexFraction = this.index / PETAL_COUNT;
      let densityScale = 1;
      if(scrollRatio > 0.35 && indexFraction > 0.70){
        densityScale = Math.max(0.35, 1 - (scrollRatio - 0.35) * 0.9);
      } else if(scrollRatio > 0.65 && indexFraction > 0.45){
        densityScale = Math.max(0.40, 1 - (scrollRatio - 0.65) * 1.1);
      }

      this.currentOpacity = this.baseOpacity * densityScale;

      // Recycle when leaving bottom or extreme sides
      if(this.y > height + this.size * 3){
        this.reset(false);
      }
      if(this.x < -40 || this.x > width + 40){
        this.reset(false);
      }
    }

    draw(ctx){
      if(this.currentOpacity <= 0.02) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.currentOpacity;

      const s = this.size;
      const w = s * this.aspect;

      // Authentic curved cherry blossom petal silhouette
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(w * 0.88, -s * 0.48, w * 0.92, s * 0.28, 0, s * 0.72);
      ctx.bezierCurveTo(-w * 0.92, s * 0.28, -w * 0.88, -s * 0.48, 0, -s);
      ctx.closePath();

      ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      ctx.fill();

      // Delicate subtle vein highlight
      ctx.strokeStyle = `rgba(255, 255, 255, 0.22)`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.65);
      ctx.quadraticCurveTo(0.2, 0, 0, s * 0.45);
      ctx.stroke();

      ctx.restore();
    }
  }

  for(let i = 0; i < PETAL_COUNT; i++){
    petals.push(new Petal(i));
  }

  let scrollRatio = 0;
  function updateScroll(){
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }
  window.addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let animId;
  function animate(){
    ctx.clearRect(0, 0, width, height);
    for(const p of petals){
      p.update(scrollRatio);
      p.draw(ctx);
    }
    animId = requestAnimationFrame(animate);
  }
  animate();

  return () => cancelAnimationFrame(animId);
}