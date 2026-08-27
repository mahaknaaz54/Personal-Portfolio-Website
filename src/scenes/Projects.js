import {reveal} from '../lib/gsap-utils.js';
import {loadProjects} from '../lib/github-projects.js';

export async function initProjects(){
  const gallery = document.querySelector('.projects-equal-gallery');
  if(!gallery) return;

  const isHomePage = gallery.dataset.page === 'home' || gallery.dataset.limit === '3';
  const limit = isHomePage ? 3 : null;

  try {
    const projects = await loadProjects();
    if(projects && projects.length > 0){
      const displayProjects = limit ? projects.slice(0, limit) : projects;
      
      // Render clean typographic cards without any images
      gallery.innerHTML = displayProjects.map(p => `
        <article class="project-equal-card" role="listitem" data-category="${p.categories || ''}">
          <div class="project-equal-card__top">
            <span class="project-equal-card__lang">${p.language || 'Software'}</span>
            <span class="project-equal-card__badge">${p.status || 'Deployed'}</span>
          </div>
          <h3 class="project-equal-card__title">${p.title}</h3>
          <p class="project-equal-card__desc">${p.description}</p>
          <ul class="project-equal-card__tech" aria-label="Technologies used">
            ${(p.topics || []).slice(0, 4).map(t => `<li><span class="tag">${t}</span></li>`).join('')}
          </ul>
          <footer class="project-equal-card__footer">
            ${p.homepageUrl ? `<a href="${p.homepageUrl}" class="project-link-main" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : `<span class="project-link-main" style="opacity: 0.6;">Active Project</span>`}
            <a href="${p.githubUrl}" class="project-link-sub" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </footer>
        </article>
      `).join('');
    }
  } catch (err) {
    console.warn('GitHub sync fallback to static curated cards:', err);
  }

  // Attach hover & touch interaction
  const cards = gallery.querySelectorAll('.project-equal-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.closest('a')) return;
      const isAlreadyExpanded = card.classList.contains('is-expanded');
      cards.forEach(c => c.classList.remove('is-expanded'));
      if(!isAlreadyExpanded){
        card.classList.add('is-expanded');
      }
    });
  });

  // Filter Bar functionality on Projects page
  const filterBtns = document.querySelectorAll('.filter-btn');
  if(filterBtns.length > 0){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
          b.classList.remove('active');
        });
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('active');

        const filter = btn.dataset.filter.toLowerCase();
        const allCards = gallery.querySelectorAll('.project-equal-card');
        allCards.forEach(card => {
          const cat = (card.dataset.category || '').toLowerCase();
          if(filter === 'all' || cat.includes(filter)){
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  reveal('.project-equal-card', {start: 'top 85%'});
}