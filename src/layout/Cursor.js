export function initCursor(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if(document.documentElement.hasAttribute('data-reduced-motion')) return;
  if('ontouchstart' in window) return; // no custom cursor on touch devices

  const cursor = document.createElement('div');
  cursor.className = 'cursor';

  const label = document.createElement('span');
  label.className = 'cursor-label';
  label.textContent = 'VIEW';
  cursor.appendChild(label);

  document.body.appendChild(cursor);

  let x = 0, y = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', e => {
    x = e.clientX;
    y = e.clientY;
  }, {passive: true});

  function lerp(){
    tx += (x - tx) * 0.12;
    ty += (y - ty) * 0.12;
    cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(lerp);
  }
  lerp();

  // Hover states
  const interactables = 'a, button, .btn';
  const projectCards = '.project-card';

  document.addEventListener('mouseover', e => {
    const card = e.target.closest(projectCards);
    const interactive = e.target.closest(interactables);

    if(card){
      cursor.classList.add('is-project');
      cursor.classList.remove('is-hover');
    } else if(interactive){
      cursor.classList.add('is-hover');
      cursor.classList.remove('is-project');
    }
  });

  document.addEventListener('mouseout', e => {
    const card = e.target.closest(projectCards);
    const interactive = e.target.closest(interactables);

    if(card){
      cursor.classList.remove('is-project');
    }
    if(interactive){
      cursor.classList.remove('is-hover');
    }
  });
}