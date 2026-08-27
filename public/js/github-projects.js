/**
 * Portfolio – Mahak Naaz
 * github-projects.js – GitHub Repository Sync
 *
 * Responsibilities (cleanly separated):
 *   1. GitHub API fetching  (with pagination + sessionStorage cache)
 *   2. Repository filtering (only "portfolio"-tagged public repos)
 *   3. Data transformation  (repo → normalized project object)
 *   4. Project card rendering (exact existing card HTML structure)
 *   5. Filter bar management (dynamic categories from topics)
 *   6. Loading / Error / Empty states
 */

'use strict';

/* ============================================================
   Configuration
   ============================================================ */
const GITHUB_CONFIG = {
  username:                 'mahaknaaz54',
  portfolioTag:             'portfolio',          // repos with this topic are prioritized
  fallbackToPublicNonForks: true,                 // if no repos have 'portfolio' tag yet, show public non-fork repos
  excludeRepos:             ['Personal-Portfolio-Website'], // repos to omit from projects list
  cacheKey:                 'gh_portfolio_repos', // sessionStorage key
  cacheTtlMs:               5 * 60 * 1000,       // 5-minute cache
  maxHomeCards:             3,                    // max cards on index.html "Recent Work"
};

/* ============================================================
   1. GitHub API Fetching
   Follows Link header pagination so all repos are fetched
   regardless of how many the user has.
   ============================================================ */
async function fetchAllRepos(username) {
  const repos = [];
  let url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=public`;

  while (url) {
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}: ${response.statusText}`);
    }

    const page = await response.json();
    repos.push(...page);

    // Follow pagination via Link header
    const linkHeader = response.headers.get('Link') || '';
    const nextMatch  = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1] : null;
  }

  return repos;
}

/* ============================================================
   Cache helpers (sessionStorage)
   ============================================================ */
function getCachedRepos() {
  try {
    const raw = sessionStorage.getItem(GITHUB_CONFIG.cacheKey);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < GITHUB_CONFIG.cacheTtlMs) return data;
    sessionStorage.removeItem(GITHUB_CONFIG.cacheKey);
  } catch (_) { /* ignore parse errors */ }
  return null;
}

function setCachedRepos(data) {
  try {
    sessionStorage.setItem(
      GITHUB_CONFIG.cacheKey,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (_) { /* ignore quota errors */ }
}

async function getRepos() {
  const cached = getCachedRepos();
  if (cached) return cached;

  const repos = await fetchAllRepos(GITHUB_CONFIG.username);
  setCachedRepos(repos);
  return repos;
}

/* ============================================================
   2. Repository Filtering
   Prioritizes public non-fork repos tagged with 'portfolio'.
   If none have the tag yet, smoothly falls back to non-fork public repos.
   ============================================================ */
function filterPortfolioRepos(repos) {
  const validRepos = repos.filter(
    (repo) => !repo.fork && !repo.private && !GITHUB_CONFIG.excludeRepos.includes(repo.name)
  );

  const tagged = validRepos.filter(
    (repo) =>
      Array.isArray(repo.topics) &&
      repo.topics.map((t) => t.toLowerCase()).includes(GITHUB_CONFIG.portfolioTag.toLowerCase())
  );

  // If any repos have the portfolio topic, strictly use only those
  if (tagged.length > 0) {
    return tagged;
  }

  // If none are tagged yet with 'portfolio', fall back to public projects
  if (GITHUB_CONFIG.fallbackToPublicNonForks) {
    return validRepos;
  }

  return [];
}

/* ============================================================
   3. Data Transformation
   Maps a raw GitHub repo object → a clean project object.
   ============================================================ */

/** Map primary language → emoji icon */
function getRepoIcon(language) {
  const map = {
    JavaScript: '💻',
    TypeScript: '💙',
    Python:     '🐍',
    HTML:       '🌐',
    CSS:        '🎨',
    Java:       '☕',
    'C++':      '⚡',
    C:          '⚙️',
    Ruby:       '💎',
    Go:         '🐹',
    Rust:       '🦀',
    Swift:      '🍎',
    Kotlin:     '🟣',
    PHP:        '🐘',
    Shell:      '🖥️',
  };
  return map[language] || '🗂️';
}

/** Derive a readable status label from repo metadata */
function getRepoStatus(repo) {
  if (repo.homepage) return 'Deployed';
  if (repo.archived) return 'Archived';
  return 'Open Source';
}

/** Check if a topic is a portfolio classification tag */
function isMetaTopic(t) {
  if (!t) return true;
  const s = t.toLowerCase().trim();
  return (
    s === 'portfolio' ||
    s === 'portfolio-website' ||
    s === 'portfolio-project' ||
    s === 'portfolio-item' ||
    s === 'portfolio-demo'
  );
}

/**
 * Build data-category string from topics and language.
 * Used by the filter bar.
 */
function getCategories(repo) {
  const cats = [];
  if (Array.isArray(repo.topics)) {
    repo.topics
      .filter((t) => !isMetaTopic(t))
      .forEach((t) => cats.push(t.toLowerCase()));
  }
  if (repo.language) {
    cats.push(repo.language.toLowerCase());
  }
  return [...new Set(cats)].join(',');
}

/** Format a repo name for display: "DewTheory" → "Dew Theory", "TO-DO" → "TO-DO" */
function formatRepoName(name) {
  if (!name) return '';
  if (name.toUpperCase() === 'TO-DO' || name.toUpperCase() === 'TODO') return 'TO-DO';
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function transformRepo(repo) {
  return {
    id:          repo.id,
    slug:        repo.name,
    title:       formatRepoName(repo.name),
    githubUrl:   repo.html_url,
    homepageUrl: repo.homepage && repo.homepage.trim() ? repo.homepage.trim() : null,
    language:    repo.language || null,
    topics:      (repo.topics || []).filter((t) => !isMetaTopic(t)),
    stars:       repo.stargazers_count,
    forks:       repo.forks_count,
    updatedAt:   repo.pushed_at || repo.updated_at,
    icon:        getRepoIcon(repo.language),
    status:      getRepoStatus(repo),
    categories:  getCategories(repo),
  };
}

/* ============================================================
   4. Project Card Rendering
   Generates HTML matching the card structure without description.
   ============================================================ */
function buildTechTagsHTML(project) {
  const tags = [];

  // Primary language first
  if (project.language) {
    tags.push(project.language);
  }

  // Topics as additional tags (capitalize nicely)
  project.topics.forEach((t) => {
    const label = t.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (!tags.includes(label)) tags.push(label);
  });

  if (tags.length === 0) tags.push('Web App');

  return tags
    .map((tag) => `<li><span class="tech-tag">${escapeHtml(tag)}</span></li>`)
    .join('');
}

function buildFooterHTML(project) {
  if (project.homepageUrl) {
    // Two-button layout (Live Demo + GitHub) — matches project-card__footer-flex
    return `
      <footer class="project-card__footer project-card__footer-flex">
        <a href="${escapeHtml(project.homepageUrl)}"
           class="project-link"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="View live demo of ${escapeHtml(project.title)} (opens in a new tab)">
          Live Demo ↗
        </a>
        <a href="${escapeHtml(project.githubUrl)}"
           class="project-link project-link--secondary"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="View source code of ${escapeHtml(project.title)} on GitHub (opens in a new tab)">
          GitHub Repository
        </a>
      </footer>`;
  }

  // Single-button layout — matches the "Planner" card style
  return `
    <footer class="project-card__footer">
      <a href="${escapeHtml(project.githubUrl)}"
         class="project-link"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="View source code of ${escapeHtml(project.title)} on GitHub (opens in a new tab)">
        View Source Code
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
             stroke-linejoin="round" aria-hidden="true" focusable="false">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </footer>`;
}

function buildProjectCardHTML(project, delayClass = '') {
  const revealClasses = `project-card reveal${delayClass ? ' ' + delayClass : ''}`;
  const categoryAttr  = project.categories ? ` data-category="${escapeHtml(project.categories)}"` : '';
  const statusClass = project.homepageUrl ? 'project-card__status pulse-once' : 'project-card__status';

  return `
    <article id="gh-project-${escapeHtml(project.slug)}"
             class="${revealClasses}"
             role="listitem"
             ${categoryAttr}
             aria-label="${escapeHtml(project.title)} project">
      <header class="project-card__header">
        <span class="project-card__icon" aria-hidden="true">${project.icon}</span>
        <span class="${statusClass}">${escapeHtml(project.status)}</span>
      </header>
      <div class="project-card__body">
        <h2 class="project-card__title">${escapeHtml(project.title)}</h2>
        <h3 class="visually-hidden">Technologies used in ${escapeHtml(project.title)}</h3>
        <ul class="project-card__tech" aria-label="Technologies used in ${escapeHtml(project.title)}">
          ${buildTechTagsHTML(project)}
        </ul>
      </div>
      ${buildFooterHTML(project)}
    </article>`;
}

/** Simple HTML escaping to prevent XSS from API data */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   Loading / Error / Empty state HTML
   ============================================================ */
const DELAY_CLASSES = ['', 'reveal--delay-1', 'reveal--delay-2', 'reveal--delay-3'];

function buildSkeletonHTML(count = 3) {
  return Array.from({ length: count }, (_, i) => `
    <article class="project-card project-card--skeleton reveal ${DELAY_CLASSES[i] || ''}"
             role="listitem" aria-hidden="true">
      <header class="project-card__header">
        <span class="project-card__icon">⬜</span>
        <span class="project-card__status">Loading</span>
      </header>
      <div class="project-card__body">
        <h2 class="project-card__title">Loading project…</h2>
        <ul class="project-card__tech">
          <li><span class="tech-tag">—</span></li>
        </ul>
      </div>
      <footer class="project-card__footer">
        <span class="project-link">Loading…</span>
      </footer>
    </article>`
  ).join('');
}

function buildErrorHTML() {
  return `
    <div class="projects-state-msg projects-state-msg--error" role="alert">
      <span class="projects-state-msg__icon" aria-hidden="true">⚠️</span>
      <p class="projects-state-msg__text">
        Couldn't reach GitHub right now. Please check your connection or
        <a href="https://github.com/${GITHUB_CONFIG.username}?tab=repositories"
           target="_blank" rel="noopener noreferrer">view repositories directly on GitHub</a>.
      </p>
    </div>`;
}

function buildEmptyHTML() {
  return `
    <div class="projects-state-msg" role="status">
      <span class="projects-state-msg__icon" aria-hidden="true">🗂️</span>
      <p class="projects-state-msg__text">
        No portfolio projects found yet. Add the
        <code class="projects-state-msg__code">portfolio</code> topic to a
        GitHub repository and it will appear here automatically.
      </p>
    </div>`;
}

/* ============================================================
   5. Filter Bar Management
   Rebuilds the filter buttons from the unique topics found across
   all fetched portfolio repos. Keeps "All" as the first button.
   ============================================================ */
function collectUniqueCategories(projects) {
  const set = new Set();
  projects.forEach((p) => {
    p.topics.forEach((t) => {
      if (t && !isMetaTopic(t)) {
        set.add(t.toLowerCase());
      }
    });
    if (p.language) {
      set.add(p.language.toLowerCase());
    }
  });
  return [...set].sort();
}

/** Format a topic slug to a nice display label */
function formatCategoryLabel(topic) {
  const map = {
    fullstack:  'Full-Stack',
    'full-stack': 'Full-Stack',
    nextjs:     'Next.js',
    'next-js':  'Next.js',
    reactjs:    'React',
    react:      'React',
    frontend:   'Frontend',
    backend:    'Backend',
    python:     'Python',
    typescript: 'TypeScript',
    javascript: 'JavaScript',
  };
  return map[topic] || topic.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function rebuildFilterBar(filterBar, projects) {
  if (!filterBar) return;

  const categories = collectUniqueCategories(projects);

  // Build new button set
  const allBtn = `<button class="filter-btn" type="button" data-filter="all"
    aria-pressed="true" aria-label="Show all projects">All</button>`;

  const catBtns = categories.map((cat) => {
    const label = formatCategoryLabel(cat);
    return `<button class="filter-btn" type="button" data-filter="${escapeHtml(cat)}"
      aria-pressed="false" aria-label="Show ${escapeHtml(label)} projects">${escapeHtml(label)}</button>`;
  }).join('');

  // Keep the label span if it exists, replace everything else
  const labelSpan = filterBar.querySelector('.filter-label');
  filterBar.innerHTML = '';
  if (labelSpan) filterBar.appendChild(labelSpan);
  filterBar.insertAdjacentHTML('beforeend', allBtn + catBtns);
}

/* ============================================================
   Filter logic (works on dynamically inserted cards)
   ============================================================ */
function attachFilterListeners(filterBar, grid) {
  if (!filterBar || !grid) return;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.filter-btn').forEach((b) =>
      b.setAttribute('aria-pressed', 'false')
    );
    btn.setAttribute('aria-pressed', 'true');

    const category = btn.dataset.filter;
    const cards = grid.querySelectorAll('.project-card[data-category]');

    cards.forEach((card) => {
      const cats = card.dataset.category.split(',').map((s) => s.trim());
      const show = category === 'all' || cats.includes(category);
      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  });

  // Arrow-key navigation
  filterBar.addEventListener('keydown', (e) => {
    const btns = [...filterBar.querySelectorAll('.filter-btn')];
    const idx = btns.indexOf(document.activeElement);
    if (idx === -1) return;

    if (e.key === 'ArrowRight' && idx < btns.length - 1) {
      e.preventDefault();
      btns[idx + 1].focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      btns[idx - 1].focus();
    }
  });
}

/* ============================================================
   Scroll reveal — re-observe newly injected cards
   ============================================================ */
function observeNewCards(grid) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Make all cards visible immediately
    grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  grid.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ============================================================
   Main orchestration – Projects Page (projects.html)
   ============================================================ */
async function initProjectsPage() {
  const grid      = document.querySelector('.projects-grid[data-page="projects"]');
  const filterBar = document.querySelector('.filter-bar');

  if (!grid) return;

  // Show skeleton loading cards
  grid.innerHTML = buildSkeletonHTML(4);

  try {
    const repos    = await getRepos();
    const filtered = filterPortfolioRepos(repos);
    const projects = filtered.map(transformRepo);

    grid.innerHTML = '';

    if (projects.length === 0) {
      grid.innerHTML = buildEmptyHTML();
      return;
    }

    // Render cards with staggered reveal delays
    const cardsHTML = projects
      .map((p, i) => buildProjectCardHTML(p, DELAY_CLASSES[i % DELAY_CLASSES.length]))
      .join('');
    grid.innerHTML = cardsHTML;

    // Rebuild filter bar from actual repo topics
    rebuildFilterBar(filterBar, projects);

    // Attach filter listeners
    attachFilterListeners(filterBar, grid);

    // Trigger scroll reveal on new cards
    observeNewCards(grid);

  } catch (err) {
    console.error('[GitHub Projects] Failed to load repositories:', err);
    grid.innerHTML = buildErrorHTML();
  }
}

/* ============================================================
   Main orchestration – Home Page (index.html)
   Shows the most-recently-updated portfolio repos (max 3).
   ============================================================ */
async function initHomePage() {
  const grid = document.querySelector('.projects-grid[data-page="home"]');
  if (!grid) return;

  // Show skeleton
  grid.innerHTML = buildSkeletonHTML(3);

  try {
    const repos    = await getRepos();
    const filtered = filterPortfolioRepos(repos);
    const projects = filtered
      .map(transformRepo)
      .slice(0, GITHUB_CONFIG.maxHomeCards); // already sorted by updated (API default)

    grid.innerHTML = '';

    if (projects.length === 0) {
      grid.innerHTML = buildEmptyHTML();
      return;
    }

    const cardsHTML = projects
      .map((p, i) => buildProjectCardHTML(p, DELAY_CLASSES[i]))
      .join('');
    grid.innerHTML = cardsHTML;

    observeNewCards(grid);

  } catch (err) {
    console.error('[GitHub Projects] Failed to load repositories:', err);
    grid.innerHTML = buildErrorHTML();
  }
}

/* ============================================================
   Entry point – detect which page we're on and initialise
   ============================================================ */
(function init() {
  if (document.querySelector('.projects-grid[data-page="projects"]')) {
    initProjectsPage();
  } else if (document.querySelector('.projects-grid[data-page="home"]')) {
    initHomePage();
  }
})();
