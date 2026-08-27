/**
 * Portfolio – Mahak Naaz
 * GitHub project loader – fetches public repos with 'portfolio' topic
 */
const GITHUB_CONFIG = {
  username: 'mahaknaaz54',
  portfolioTag: 'portfolio',
  fallbackToPublicNonForks: true,
  excludeRepos: ['Personal-Portfolio-Website'],
  cacheKey: 'gh_portfolio_repos_v2',
  cacheTtlMs: 5 * 60 * 1000,
};

async function fetchAllRepos(username) {
  const repos = [];
  let url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=public`;
  while (url) {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const page = await res.json();
    repos.push(...page);
    const link = res.headers.get('Link') || '';
    const next = link.match(/<([^>]+)>;\s*rel="next"/);
    url = next ? next[1] : null;
  }
  return repos;
}

function getCachedRepos() {
  try {
    const raw = sessionStorage.getItem(GITHUB_CONFIG.cacheKey);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < GITHUB_CONFIG.cacheTtlMs) return data;
    sessionStorage.removeItem(GITHUB_CONFIG.cacheKey);
  } catch (_) {}
  return null;
}

function setCachedRepos(data) {
  try {
    sessionStorage.setItem(GITHUB_CONFIG.cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (_) {}
}

async function getRepos() {
  const cached = getCachedRepos();
  if (cached) return cached;
  const repos = await fetchAllRepos(GITHUB_CONFIG.username);
  setCachedRepos(repos);
  return repos;
}

function filterPortfolioRepos(repos) {
  const valid = repos.filter(r => !r.fork && !r.private && !GITHUB_CONFIG.excludeRepos.includes(r.name));
  const tagged = valid.filter(r => Array.isArray(r.topics) && r.topics.map(t => t.toLowerCase()).includes(GITHUB_CONFIG.portfolioTag.toLowerCase()));
  if (tagged.length) return tagged;
  if (GITHUB_CONFIG.fallbackToPublicNonForks) return valid;
  return [];
}

function getRepoStatus(r) {
  if (r.homepage) return 'Deployed';
  if (r.archived) return 'Archived';
  return 'Open Source';
}

function isMeta(t) {
  if (!t) return true;
  const s = t.toLowerCase().trim();
  return ['portfolio', 'portfolio-website', 'portfolio-project', 'portfolio-item', 'portfolio-demo'].includes(s);
}

function getCategories(r) {
  const cats = new Set();
  (r.topics || []).filter(t => !isMeta(t)).forEach(t => cats.add(t.toLowerCase()));
  if (r.language) cats.add(r.language.toLowerCase());
  return [...cats].join(',');
}

function formatRepoName(name) {
  if (!name) return '';
  const upper = name.toUpperCase();
  if (upper === 'TO-DO' || upper === 'TODO') return 'To-Do List';
  if (upper === 'WEATHER') return 'Weather App';
  if (upper === 'DEWTHEORY') return 'Dew Theory';
  if (upper === 'LUNA') return 'Luna';
  if (upper === 'ATELIER') return 'Atelier';
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
}

function getCustomDescription(r) {
  if (r.description && r.description.trim()) return r.description.trim();
  const name = r.name.toLowerCase();
  if (name.includes('todo') || name.includes('to-do')) {
    return 'A dynamic task and productivity management web application featuring local storage persistence, category tagging, and clean responsive interface.';
  }
  if (name.includes('weather')) {
    return 'Real-time weather forecasting and atmospheric dashboard application fetching live meteorological data with fluid responsive UI.';
  }
  if (name.includes('luna')) {
    return 'An interactive React web application built with Vite and serverless API integration, providing smooth performance and modern component architecture.';
  }
  if (name.includes('dew')) {
    return 'A sleek, modern web platform crafted with HTML5, CSS3, and Tailwind CSS with fluid responsiveness and aesthetic component design.';
  }
  if (name.includes('atelier')) {
    return 'A full-stack web application designed for a digital fashion studio and creative workspace with client-server architecture and live cloud deployment.';
  }
  return 'A modern software application built with clean architecture and responsive design.';
}

function transformRepo(r) {
  return {
    id: r.id,
    slug: r.name,
    title: formatRepoName(r.name),
    description: getCustomDescription(r),
    githubUrl: r.html_url,
    homepageUrl: r.homepage && r.homepage.trim() ? r.homepage.trim() : null,
    language: r.language || 'JavaScript',
    topics: (r.topics || []).filter(t => !isMeta(t)),
    stars: r.stargazers_count,
    forks: r.forks_count,
    updatedAt: r.pushed_at || r.updated_at,
    status: getRepoStatus(r),
    categories: getCategories(r),
  };
}

export async function loadProjects() {
  const repos = await getRepos();
  const filtered = filterPortfolioRepos(repos);
  return filtered.map(transformRepo);
}